#!/bin/bash

echo "🐳 启动黄宾虹艺术平台服务..."

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
else
    echo "❌ 错误：未找到 .env 文件"
    echo "请复制 .env.example 为 .env 并配置相应参数"
    exit 1
fi

# 检查必要的环境变量
if [ -z "$PORT" ] || [ -z "$DATA_PATH" ] || [ -z "$DATABASE_PATH" ]; then
    echo "❌ 错误：缺少必要的环境变量"
    echo "请检查 .env 文件中的 PORT、DATA_PATH 和 DATABASE_PATH 配置"
    exit 1
fi

# 停止并删除旧容器
docker stop huangbinhong cloudflared-tunnel 2>/dev/null
docker rm huangbinhong cloudflared-tunnel 2>/dev/null

# 创建数据目录
mkdir -p "$DATA_PATH"
DATA_PATH=$(realpath "$DATA_PATH")

# 启动后端服务
docker run -d \
  --name huangbinhong \
  -p "$PORT:$PORT" \
  -v "$DATA_PATH":/app/data \
  -e PORT="$PORT" \
  -e DATABASE_PATH="$DATABASE_PATH" \
  -e CORS_ALLOW_ORIGIN="${CORS_ALLOW_ORIGIN:-*}" \
  huangbinhong:latest

echo "✅ 后端服务已启动"

# 如果配置了 Cloudflare Tunnel，启动 cloudflared
if [ ! -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
    echo "🌐 启动 Cloudflare Tunnel..."
    docker run -d \
      --network host \
      --name cloudflared-tunnel \
      cloudflare/cloudflared:latest \
      tunnel --no-autoupdate run --token $CLOUDFLARE_TUNNEL_TOKEN

    echo "✅ Cloudflare Tunnel 已启动"
else
    echo "ℹ️  未配置 CLOUDFLARE_TUNNEL_TOKEN，跳过内网穿透"
fi

echo "本地访问: http://localhost:${PORT}"
