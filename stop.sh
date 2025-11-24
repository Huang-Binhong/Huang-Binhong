#!/bin/bash

echo "🛑 停止黄宾虹艺术平台服务..."

# 检查容器是否存在
containers_exist=false

if docker ps -a | grep -q "huangbinhong"; then
    containers_exist=true
    docker stop huangbinhong
    echo "✅ 后端容器已停止"
fi

if docker ps -a | grep -q "cloudflared-tunnel"; then
    containers_exist=true
    docker stop cloudflared-tunnel
    echo "✅ Cloudflare Tunnel 已停止"
fi

if [ "$containers_exist" = false ]; then
    echo "ℹ️  容器不存在或已停止"
    exit 0
fi

# 询问是否删除容器
read -p "是否删除容器? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rm huangbinhong cloudflared-tunnel 2>/dev/null
    echo "✅ 容器已删除"
else
    echo "ℹ️  容器已保留，可用 ./run.sh 重新启动"
fi

echo ""
echo "查看状态: ./status.sh"
