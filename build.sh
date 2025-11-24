#!/bin/bash

echo "🔨 开始构建 Docker 镜像..."

# 使用 Docker 更新 go.sum
echo "📦 更新 Go 依赖..."
docker run --rm \
  -v "$PWD":/app \
  -w /app \
  -e GOPROXY=https://goproxy.cn,direct \
  golang:1.21-alpine \
  go mod tidy

# 构建主服务镜像（启用 BuildKit 以使用缓存挂载）
DOCKER_BUILDKIT=1 docker build -t huangbinhong:latest .

if [ $? -ne 0 ]; then
    echo "❌ 主服务构建失败"
    exit 1
fi

echo "✅ 构建成功！"
echo "运行服务: ./run.sh"
