#!/bin/bash

echo "🧹 清理 Docker 资源..."
echo ""

# 显示当前资源使用
echo "清理前："
docker system df
echo ""

# 停止项目容器
if docker ps | grep -q "huangbinhong"; then
    echo "停止项目容器..."
    docker stop huangbinhong
fi

# 删除项目容器
if docker ps -a | grep -q "huangbinhong"; then
    echo "删除项目容器..."
    docker rm huangbinhong
fi

# 询问是否删除镜像
read -p "是否删除 huangbinhong 镜像? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi huangbinhong:latest 2>/dev/null
    echo "✅ 镜像已删除"
fi

# 询问是否清理无用资源
read -p "是否清理所有无用的 Docker 资源 (悬空镜像、停止的容器等)? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "清理悬空镜像..."
    docker image prune -f

    echo "清理停止的容器..."
    docker container prune -f

    echo "清理未使用的网络..."
    docker network prune -f

    echo "清理未使用的卷..."
    docker volume prune -f

    echo "清理构建缓存（包括所有未使用的缓存）..."
    docker builder prune -a -f

    echo "✅ 清理完成"
fi

echo ""
echo "清理后："
docker system df
echo ""
echo "查看状态: ./status.sh"
