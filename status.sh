#!/bin/bash

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

echo "======================================"
echo "🐳 Docker 状态总览"
echo "======================================"
echo ""

echo "📦 本地镜像列表："
echo "--------------------------------------"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | head -20
echo ""

echo "📊 镜像统计："
echo "  总数: $(docker images -q | wc -l) 个"
echo "  占用空间: $(docker images --format '{{.Size}}' | awk '{s+=$1} END {print s}') "
echo ""

echo "🚀 运行中的容器："
echo "--------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "💤 所有容器（包括停止的）："
echo "--------------------------------------"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
echo ""

echo "🌐 Docker 网络："
echo "--------------------------------------"
docker network ls
echo ""

echo "💾 Docker 卷："
echo "--------------------------------------"
docker volume ls
echo ""

echo "📈 系统资源使用："
echo "--------------------------------------"
docker system df
echo ""

# 如果有 huangbinhong 相关的容器或镜像，高亮显示
if docker images | grep -q "huangbinhong"; then
    echo "✅ 项目镜像 huangbinhong 已构建"
fi

if docker ps | grep -q "huangbinhong"; then
    echo "✅ 项目容器 huangbinhong 正在运行"
    if [ ! -z "$PORT" ]; then
        echo "   访问地址: http://localhost:$PORT"
    fi
elif docker ps -a | grep -q "huangbinhong"; then
    echo "⚠️  项目容器 huangbinhong 已停止"
    echo "   启动命令: ./run.sh"
else
    echo "ℹ️  项目容器尚未创建"
    echo "   运行命令: ./run.sh"
fi

if docker ps | grep -q "cloudflared-tunnel"; then
    echo "✅ Cloudflare Tunnel 正在运行"
fi

echo ""
echo "======================================"
