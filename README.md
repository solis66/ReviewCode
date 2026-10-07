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
│       └── leetcode-28-strstr.html
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


