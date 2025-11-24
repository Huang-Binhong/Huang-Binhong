# 构建阶段
FROM golang:1.21-alpine AS builder

# 使用国内镜像源加速
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 使用构建参数传递代理（在 docker-compose 或 docker build 时传入）
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=${HTTP_PROXY} \
    HTTPS_PROXY=${HTTPS_PROXY} \
    GOPROXY=https://goproxy.cn,direct

# 安装必要的工具
RUN apk add --no-cache git gcc musl-dev

# 设置工作目录
WORKDIR /app

# 复制 go mod 文件（只复制依赖相关文件，利用缓存）
COPY go.mod go.sum* ./

# 下载依赖（使用缓存挂载加速，只要 go.mod 不变，这层会被缓存）
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

# 复制源代码（代码改动只影响这一层之后）
COPY *.go ./
COPY database ./database
COPY handlers ./handlers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes

# 构建应用（使用 Go 模块和构建缓存加速）
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -o main .

# 运行阶段
FROM alpine:latest

# 使用国内镜像源加速
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 ca-certificates 用于 HTTPS 请求
RUN apk --no-cache add ca-certificates

WORKDIR /app

# 创建数据目录
RUN mkdir -p /app/data

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .

# 复制数据库相关文件
COPY --from=builder /app/database ./database

# 运行应用
CMD ["./main"]
