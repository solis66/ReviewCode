# 算法可视化题库 · 静态站点

把 `ReviewCode` 里的算法题可视化 HTML 收拢成一个可检索、可内嵌预览的门户页，纯静态、零后端，扔到 nginx 上就能跑。

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

**为什么把中文文件名改成 `344-reverse-string.html`？**
中文文件名在 URL 里必须做百分号编码，跨服务器、跨系统（Windows 打包 → Linux 解压）时很容易出现 `404` 或乱码。统一改成 ASCII 短链名后，链接稳定、可分享，也不会被某些 CDN/网关拒绝。

---

## 二、本地看一眼

```bash
cd site
"C:/Users/20931/.workbuddy/binaries/python/versions/3.13.12/python.exe" tools/build.py   # 生成清单
cd public && "C:/Users/20931/.workbuddy/binaries/python/versions/3.13.12/python.exe" -m http.server 8777
```

浏览器打开 <http://127.0.0.1:8777>。

> 直接双击 `public/index.html`（file:// 协议）也能看列表和卡片，但**内嵌预览会被浏览器的本地文件安全策略挡住**。要看预览必须走 HTTP 服务。

---

## 三、以后加新题

1. 把新的可视化 HTML 丢进源目录（默认是 `C:\Users\20931\Desktop\ReviewCode`）。
2. 在 `tools/meta.json` 的 `problems` 里补一条，key 就是原始文件名：
   ```json
   "454.四数相加Ⅱ.html": {
     "id": "454-four-sum-ii",
     "order": 5,
     "no": "454",
     "platform": "LeetCode",
     "title": "四数相加 Ⅱ",
     "subtitle": "变量变化动画",
     "category": "哈希 · 分组",
     "tags": ["哈希表", "分组统计"],
     "level": "中等",
     "language": "Java",
     "theme": "light",
     "summary": "把四个数组两两分组，用哈希表换时间。",
     "complexity": "时间 O(n²) · 空间 O(n²)"
   }
   ```
   不补也能跑——脚本会按文件名自动识别，只是标题和标签会粗糙一些。
3. 重新构建：`python tools/build.py`
4. 重新上传：跑一遍 `deploy.sh`，或方式 B 执行 `docker compose up -d --build`。

源目录不在 ReviewCode 时，加参数指定：

```bash
python tools/build.py --src "C:/Users/20931/Desktop/leetcode"
```

---

## 四、部署到轻量应用服务器

你那边跑的是 **nginx + docker**，下面三条路任选。

### 方式 A：挂到已有的 nginx 上（最省事，推荐先试）

**A1. 先确认现有 nginx 是怎么托管的。**

```bash
# 看正在跑的容器
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'

# 看 nginx 容器挂载了哪些宿主机目录
docker inspect <nginx容器名> --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{"\n"}}{{end}}'
```

- **如果已经挂了宿主机目录**（比如 `/www/wwwroot` → `/usr/share/nginx/html`），那就直接上传到那个宿主机目录下的一个子目录即可，比如 `/www/wwwroot/algo`，然后跳到 A2 加 server 块。
- **如果没挂任何目录**，就需要改 compose 加一行挂载再重建容器——这一步会影响现有站点，建议直接改用**方式 B**，互不干扰。

**A2. 上传站点内容。**

在 Windows 上（Git Bash / WSL）：

```bash
cd site
chmod +x deploy.sh
./deploy.sh root@<服务器IP> /www/wwwroot/algo
```

没有 rsync 就用 scp：

```bash
ssh root@<服务器IP> "mkdir -p /www/wwwroot/algo"
scp -r public/* root@<服务器IP>:/www/wwwroot/algo/
```

**A3. 加一个 server 块。**

在现有 nginx 的 `conf.d/` 里新建 `algo.conf`：

```nginx
server {
    listen 80;
    server_name algo.example.com;      # 没有域名就写服务器公网 IP
    root /usr/share/nginx/html/algo;   # 注意这里是容器内路径，对应 A1 里的挂载
    index index.html;
    charset utf-8;
    location = /index.html { add_header Cache-Control "no-store, must-revalidate"; }
    location = /problems.js { add_header Cache-Control "no-store, must-revalidate"; }
    location / { try_files $uri $uri/ /index.html; }
}
```

校验并热加载：

```bash
docker exec <nginx容器名> nginx -t          # 期望 syntax is ok / test is successful
docker exec <nginx容器名> nginx -s reload
```

---

### 方式 B：独立容器（和现有站点零耦合，推荐）

在服务器上：

```bash
# 1. 上传整个 site 目录（含 Dockerfile）
scp -r site root@<服务器IP>:/opt/algo-site

# 2. 构建并启动
cd /opt/algo-site
docker compose up -d --build

# 3. 看状态
docker compose ps
docker compose logs -f --tail=50
```

访问 `http://<服务器IP>:8090`。

> 端口 8090 是为了避开现有 nginx 的 80/443。要改就改 `docker-compose.yml` 里 `ports` 的左边数字。

**别忘了放行端口**：腾讯云轻量 → 控制台「防火墙」；阿里云轻量 → 「安全组」。没放行的话本机 `curl` 通、外网打不开，这是最常见的一个坑。

---

### 方式 C：宝塔面板

1. 网站 → 添加站点，域名填 IP 或你的域名，不要 PHP、不要数据库。
2. 上传 `public/` 里的**全部内容**到站点根目录（默认 `/www/wwwroot/<域名>`）。
   - 注意是 `public/` 里的内容，不是 `public` 这个文件夹本身。
3. 设置 → 默认文档确认有 `index.html`。
4. 伪静态留空或选 none（本站是 hash 路由，不需要 rewrite 规则）。

---

### 方式 D：GitHub 拉取部署（用 `git pull` 更新）

**仓库根目录就放在 `site/`**，这个目录本身就是完整的可部署工程。

`public/` 下的内容是 `build.py` 的产物，**必须一起提交**——这样服务器上只要有 git + docker，
不用装 Python，也不用在服务器上跑构建。

**1. 本地首次提交**

```bash
cd site
git init -b main
git add -A
git commit -m "feat: 算法可视化题库静态站点"

# 先在 GitHub 建好一个空仓库（不要勾选自动生成 README/.gitignore），然后：
git remote add origin git@github.com:<用户名>/<仓库名>.git
git push -u origin main
```

**2. 服务器上拉取并启动**

```bash
git clone git@github.com:<用户名>/<仓库名>.git /opt/algo-site
cd /opt/algo-site
docker compose -f docker-compose.mount.yml up -d
```

私有仓库要在服务器上配 SSH key：`ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519`，
把 `~/.ssh/id_ed25519.pub` 内容加到仓库的 **Deploy keys**（勾只读即可）。
公开仓库直接把地址换成 `https://github.com/...`，不需要任何凭据。

**3. 日常更新**

```bash
cd /opt/algo-site && git pull --ff-only
```

用的是挂载式（`docker-compose.mount.yml`）的话，到这一步就完事了，刷新页面即是新内容——
nginx 每次请求都读磁盘，不用重建镜像也不用重启容器。

如果用的是 Dockerfile 那套（`docker-compose.yml`），改成：

```bash
cd /opt/algo-site && git pull --ff-only && docker compose up -d --build
```

**4. 这条路线的三个坑**

| 坑 | 后果 | 处理 |
| --- | --- | --- |
| CRLF 换行符进仓库 | 服务器上 `deploy.sh` 报 `bash\r: No such file or directory` | 仓库里已放 `.gitattributes` 强制 `*.sh` 用 LF，别删 |
| 忘了先跑 `build.py` 就提交 | 本地看着是新的，服务器拉到的还是旧内容 | 改完题目固定动作：`python tools/build.py` → `git add -A` → commit |
| 服务器拉不到 Docker Hub 镜像 | `docker compose up` 报 `pull access denied` 或超时 | 复用服务器上已有的 nginx 镜像（改 `image:` 那一行），或配 `/etc/docker/daemon.json` 的 `registry-mirrors` |

> **关于「国内服务器拉 GitHub 慢」**：本仓库成品只有 **146 KB / 14 个文件**，
> 即便按 40 KB/s 的龟速算也就几秒钟，不用担心 clone 卡住。
> 真正常见的拉取失败是 **Docker Hub 镜像**，不是 git——这点别搞反了。
> 万一 GitHub 完全连不上，把仓库导入 Gitee 再从 Gitee 拉即可，`git pull` 流程完全一样。

---

## 五、部署后自检

```bash
curl -I http://<域名或IP>/                      # 期望 200
curl -s http://<域名或IP>/problems.js | head    # 期望看到 window.__PROBLEMS__
curl -I http://<域名或IP>/problems/344-reverse-string.html   # 每题单独可开
```

页面上逐项确认：

- [ ] 概览页出现 4 张题卡，题号/平台/标签正常
- [ ] 点卡片能进入演示页，动画的「播放 / 单步」可用
- [ ] 顶栏搜索框输入 `KMP`、`双指针` 能筛出对应题目
- [ ] 手机/窄窗口下左上角出现列表按钮，点开是抽屉
- [ ] 深浅色切换正常（会影响门户壳，不影响演示页内部配色）

---

## 六、常见失败原因

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 外网打不开，服务器上 `curl localhost` 正常 | 云防火墙/安全组没放行端口 | 控制台放行 80（方式 B 是 8090） |
| 页面能开但题目列表空白，控制台报 `problems.js 404` | 上传时漏了文件，或上传到了上一层目录 | 确认服务器根目录下直接就是 `index.html` 和 `problems.js` |
| 点题目卡住或 404 | `public/problems/` 没上传完整 | `ls /站点根/problems/` 应有 4 个 html |
| 演示页样式错乱、字体很小 | 用 `file://` 直接打开的，或走了下载而不是预览 | 必须通过 HTTP 访问 |
| 改了题但页面没变 | 浏览器缓存或忘了重新构建 | 重新跑 `build.py` 再上传；`index.html`、`problems.js` 已配 `no-store` |
| 中文标题显示成乱码 | nginx 没声明 charset | `nginx.conf` 里已有 `charset utf-8;`，若用自建配置需补上 |

---

## 七、回滚

方式 B：

```bash
cd /opt/algo-site
docker compose down          # 停掉并移除容器（镜像仍在）
docker images | grep algo-visual
```

方式 A/C：上传前先备份一次旧目录，回滚就是拷回去：

```bash
ssh root@<服务器IP> "cp -r /www/wwwroot/algo /www/wwwroot/algo.bak.$(date +%Y%m%d%H%M)"
```

---

## 八、门户页快捷操作

| 操作 | 说明 |
| --- | --- |
| `/` | 光标跳到搜索框 |
| `Esc` | 退出搜索 / 关闭移动端抽屉 / 从演示页返回概览 |
| `←` `→` | 演示页里切换上一题 / 下一题 |
| 顶栏月亮/太阳 | 切换深浅色，选择记在 localStorage |
| 演示页「复制链接」 | 复制形如 `http://…/#/344-reverse-string` 的直达链接，可直接分享 |

> `复制链接` 在非 HTTPS 环境下用的是 `document.execCommand` 兜底（浏览器的剪贴板 API 要求安全上下文），所以 http 访问也能用。
