# 简介

static_server 是一个简单的 NodeJS Static Web Server。

# 安装

```
npm install -g static_server
```

# 使用方法

```
# 把当前文件夹作为静态资源服务器
static_server

# 自定义文件夹
static_server -d /usr

# 自定义端口
static_server -p 8080

# 自定义 host 名
static_server -h localhost
```