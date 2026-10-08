#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把源目录里的题目 HTML 整理成门户站点可用的形式。

做三件事：
  1. 从源目录（默认 = site/ 的上一级，也就是 ReviewCode）里挑出所有题目 HTML；
  2. 按 meta.json 的描述复制成 ASCII 短链名，放到 public/problems/ 下
     （中文文件名在 URL 里要百分号编码，跨服务器/跨系统很容易踩坑，统一改掉）；
  3. 生成 public/problems.js，门户首页读它来渲染列表。

用法：
    python build.py
    python build.py --src "C:/Users/20931/Desktop/leetcode"
    python build.py --src "C:/Users/20931/Desktop/leetcode" --out "C:/Users/20931/Desktop/ReviewCode/site/public"
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

HERE = Path(__file__).resolve().parent          # site/tools
SITE_ROOT = HERE.parent                          # site
DEFAULT_SRC = SITE_ROOT.parent                   # ReviewCode
DEFAULT_OUT = SITE_ROOT / "public"
META_FILE = HERE / "meta.json"

CST = timezone(timedelta(hours=8))


def load_meta() -> dict:
    if not META_FILE.exists():
        print(f"[!] 找不到 {META_FILE}，将只做自动识别。")
        return {}
    with META_FILE.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def slugify(text: str) -> str:
    """把任意文本变成 URL 安全的短链片段。"""
    text = re.sub(r"[^0-9A-Za-z]+", "-", text or "")
    return text.strip("-").lower()


def normalize_categories(item: dict) -> list[str]:
    """把 category（单值·旧）与 categories（数组·新）统一成 categories 列表。

    兼容三种写法：
      * 只写 categories（推荐）：直接用；
      * 只写 category（历史数据）：包装成单元素列表；
      * 两者都写：以 categories 为准。

    统一后会把 categories[0] 回填到 category，这样只认旧字段的消费者
    （例如尚未升级的页面）不会因为新增字段而读不到分类。
    """
    raw = item.get("categories")
    if not isinstance(raw, list):
        raw = []
    if not raw:
        single = item.get("category")
        raw = [single] if single else []

    names: list[str] = []
    for name in raw:
        name = str(name).strip()
        # 去重且保持书写顺序：同一题不会在目录里重复出现，顺序也由作者决定
        if name and name not in names:
            names.append(name)
    if not names:
        names = ["未分类"]

    item["categories"] = names
    item["category"] = names[0]
    return names


def derive(html_file: Path, index: int) -> dict:
    """meta.json 里没登记时的兜底识别。"""
    stem = html_file.stem
    m = re.search(r"(\d+)", stem)
    no = m.group(1) if m else ""
    low = stem.lower()
    if "leetcode" in low:
        platform = "LeetCode"
    elif "卡玛" in stem or "kama" in low:
        platform = "卡玛网"
    else:
        platform = "本地"

    title = re.sub(r"^[^.\d]*\.?", "", stem)
    title = re.sub(r"^\d+\.?", "", title)
    title = re.sub(r"_?静态网页$", "", title).strip(" ._-")
    title = title or stem

    prefix = slugify(platform) or "local"
    body = slugify(title)
    short_id = f"{prefix}-{no}-{body}".strip("-") if no else f"{prefix}-{body}"
    short_id = re.sub(r"-+", "-", short_id) or f"{prefix}-problem-{index}"

    return {
        "id": short_id,
        "order": 1000 + (int(no) if no.isdigit() else index),
        "no": no,
        "platform": platform,
        "title": title,
        "subtitle": "",
        "category": "未分类",
        "tags": [],
        "level": "",
        "language": "",
        "theme": "light",
        "summary": f"来自 {html_file.name} 的交互式演示页面。",
        "complexity": "",
    }


def collect(src: Path, out: Path, meta: dict) -> list[dict]:
    if not src.is_dir():
        sys.exit(f"[x] 源目录不存在：{src}")

    dest_dir = out / "problems"
    dest_dir.mkdir(parents=True, exist_ok=True)

    known = meta.get("problems", {})
    # 题目源文件统一放在仓库根目录，public/problems 由构建过程生成。
    files = sorted(p for p in src.glob("*.html") if p.is_file() and p.name != "index.html")
    if not files:
        sys.exit(f"[x] 源目录里没有找到任何 .html 题目文件：{src}")

    problems: list[dict] = []
    used_ids: set[str] = set()

    for i, path in enumerate(files, start=1):
        item = dict(known.get(path.name) or derive(path, i))
        item.setdefault("order", 1000 + i)
        normalize_categories(item)

        if path.name not in known:
            print(f"[~] {path.name} 未在 meta.json 登记，已按文件名自动识别。")

        # id 去重
        base_id = item["id"]
        n = 2
        while item["id"] in used_ids:
            item["id"] = f"{base_id}-{n}"
            n += 1
        used_ids.add(item["id"])

        target = dest_dir / f"{item['id']}.html"
        if path.resolve() != target.resolve():
            shutil.copy2(path, target)

        raw = target.read_bytes()
        item["file"] = f"problems/{target.name}"
        item["bytes"] = len(raw)
        item["fingerprint"] = hashlib.sha1(raw).hexdigest()[:10]
        item["updated"] = datetime.fromtimestamp(path.stat().st_mtime, CST).strftime("%Y-%m-%d %H:%M")
        item["source"] = path.name

        problems.append(item)
        print(f"[+] {item['platform']:<9} {item['no']:>4}  {item['title']}  ->  {item['file']}")

    problems.sort(key=lambda x: (x.get("order", 9999), x.get("platform", ""), x.get("no", "")))
    return problems


def write_manifest(out: Path, meta: dict, problems: list[dict]) -> None:
    site = meta.get("site") or {}
    payload = {
        "generatedAt": datetime.now(CST).strftime("%Y-%m-%d %H:%M:%S"),
        "site": {
            "title": site.get("title") or "算法可视化题库",
            "subtitle": site.get("subtitle") or "",
            "description": site.get("description") or "",
        },
        "problems": problems,
    }

    js = out / "problems.js"
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    js.write_text(
        "/* 本文件由 tools/build.py 自动生成，重新运行脚本会覆盖。\n"
        "   小改文案可以直接手改，但下次 build 会被 meta.json 里的值覆盖。 */\n"
        f"window.__PROBLEMS__ = {body};\n",
        encoding="utf-8",
        newline="\n",  # 固定 LF：Windows 上默认会转成 CRLF，导致提交进 git 后每次 build 都产生假 diff
    )
    print(f"\n[=] 已写出 {js}（共 {len(problems)} 题）")


def main() -> None:
    ap = argparse.ArgumentParser(description="生成算法可视化题库站点的题目清单")
    ap.add_argument("--src", default=str(DEFAULT_SRC), help="题目 HTML 所在目录")
    ap.add_argument("--out", default=str(DEFAULT_OUT), help="站点 public 目录")
    args = ap.parse_args()

    src = Path(args.src).resolve()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)

    print(f"[=] 源目录：{src}")
    print(f"[=] 输出到：{out}\n")

    meta = load_meta()
    problems = collect(src, out, meta)
    write_manifest(out, meta, problems)
    print("[OK] 构建完成。")


if __name__ == "__main__":
    main()
