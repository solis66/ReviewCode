#!/usr/bin/env bash
# 把站点内容同步到服务器。
#
# 用法：
#   ./deploy.sh <user@host> <远程目录> [--delete]
#
# 例子：
#   ./deploy.sh root@1.2.3.4 /www/wwwroot/algo          # 只上传/覆盖
#   ./deploy.sh root@1.2.3.4 /www/wwwroot/algo --delete # 顺带清理远程多余文件
#
# 前提：本机能免密登录该服务器（已配好 SSH key）。没配的话先跑 ssh-copy-id。
set -euo pipefail

REMOTE="${1:-}"
DEST="${2:-}"
MODE="${3:-}"

if [ -z "$REMOTE" ] || [ -z "$DEST" ]; then
  echo "用法: ./deploy.sh <user@host> <远程目录> [--delete]"
  echo "例子: ./deploy.sh root@1.2.3.4 /www/wwwroot/algo"
  exit 1
fi

cd "$(dirname "$0")"

if [ ! -f public/index.html ]; then
  echo "[x] 找不到 public/index.html，请先运行：python tools/build.py"
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "[x] 本机没有 rsync。可改用 scp："
  echo "    ssh ${REMOTE} \"mkdir -p ${DEST}\" && scp -r public/* ${REMOTE}:${DEST}/"
  exit 1
fi

FLAGS=(-avz --human-readable)
if [ "$MODE" = "--delete" ]; then
  echo "[!] 已启用 --delete：远程目录中本地不存在的文件会被删除，确认这个目录只放本站内容。"
  FLAGS+=(--delete)
fi

echo "==> 目标：${REMOTE}:${DEST}"
ssh "$REMOTE" "mkdir -p '${DEST}'"
rsync "${FLAGS[@]}" public/ "${REMOTE}:${DEST}/"

echo
echo "==> 远程目录："
ssh "$REMOTE" "ls -lh '${DEST}'"
echo
echo "==> 建议自检：curl -I http://<你的域名或IP>/  （期望 HTTP/1.1 200）"
