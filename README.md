# 代码随想录对应的算法逻辑原理动画展示静态资源网页
---

## 一、目录说明

```
site/
├── public/                  ← 站点内容，部署时上传的就是这一层
│   ├── index.html           门户首页（题目列表 + 概览卡片 + iframe 内嵌预览）
│   ├── problems.js          题目清单（由 build.py 生成）
│   └── problems/            各题演示页（已改成 ASCII 短链名）
│       ├── 344-reverse-string.html
│       ├── 541-reverse-string-ii.html
│       ├── kamacoder-55-right-rotate.html
│       ├── leetcode-28-strstr.html
│       ├── leetcode-459-repeated-substring.html
│       └── leetcode-27-remove-element.html
├── tools/
│   ├── meta.json            题目元数据（题号/平台/难度/标签/摘要 …）
│   └── build.py             扫描源目录 → 复制改名 → 生成 problems.js
├── Dockerfile               方式 B 用
├── docker-compose.yml       方式 B：构建镜像后运行
├── docker-compose.mount.yml 方式 D：直接挂载 public/，git pull 即生效
├── nginx.conf               站点配置（两种容器方式共用）
├── deploy.sh                方式 A/C 的上传脚本
├── .gitattributes           强制 LF，防止 shell 脚本被 CRLF 搞坏
├── .gitignore
└── README.md
```

---

## 二、新增一道题

1. 把演示页 HTML 放到源目录（默认是 `site/` 的上一级 `ReviewCode/`，可用 `--src` 指定别处）。
2. 在 `tools/meta.json` 的 `problems` 里补一条，key 必须与磁盘上的**文件名完全一致**。
3. 运行构建，然后提交：

```bash
python tools/build.py
git add -A && git commit -m "feat: 新增 xxx 演示页" && git push
```

`public/problems/*.html` 和 `public/problems.js` 都是 `build.py` 的产物，但**需要一起提交**——
这样服务器只要 `git pull` 就能更新，不必装 Python、不必跑构建。

### 分类：一道题可以挂多个专题

用 `categories` 数组，写几个就会在门户目录里的几个专题下同时出现：

```json
"categories": ["数组", "双指针法"]
```

- 专题在目录里的先后顺序由 `public/index.html` 的 `CATEGORY_ORDER` 决定；
  里面没登记的新专题会自动追加到末尾，不会丢题。
- `category`（单值）是旧写法，仍然兼容；两者都写时以 `categories` 为准，
  构建时会自动把 `categories[0]` 回填到 `category`。


