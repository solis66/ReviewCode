# 纯静态站点：把 public/ 直接交给 nginx 托管
# 构建：docker build -t algo-visual-portal .
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="algo-visual-portal" \
      org.opencontainers.image.description="算法可视化题库 · 静态站点"

# 站点配置（替换镜像自带的 default.conf）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 站点内容
COPY public/ /usr/share/nginx/html/

EXPOSE 80

# 容器自带 wget（busybox），用它做健康检查最省事
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
