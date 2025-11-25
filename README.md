# ArtChronicle - 黄宾虹书画艺术大展数字平台

一个基于 Go 语言开发的数字人文后端 API 服务，专注于艺术家生平、作品、事件及人际关系的数据管理与展示。

[![Go Version](https://img.shields.io/badge/Go-1.21-blue.svg)](https://golang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [数据库设计](#数据库设计)
- [开发指南](#开发指南)
- [故障排查](#故障排查)

## ✨ 功能特性

### 数据库当前状态

- **👤 人物 (Persons)**: 1 条记录（黄宾虹完整信息）✅
- **🎨 作品 (Works)**: 332 条记录（黄宾虹书法作品，含尺寸、钤印、款识等完整字段）✅
- **📅 事件 (Events)**: 55 条记录（黄宾虹生平事件，含历史背景）✅
- **📍 地点 (Locations)**: 0 条记录（支持 API 创建）
- **🔗 关系 (Relations)**: 0 条记录（支持 API 创建）

### 核心功能

- **完整 CRUD API**: 5大核心实体的增删改查
  - 👤 人物管理（Persons）
  - 🎨 作品管理（Works）- 支持书法作品专属字段（创作年代、尺寸、钤印、款识、图片网址）
  - 📅 事件管理（Events）- 支持 JSON 历史事件数组
  - 📍 地点管理（Locations）
  - 🔗 关系管理（Relations）

- **高级查询功能**
  - 分页查询（page & pageSize）
  - 模糊搜索（姓名、别名、作品标题）
  - 多条件筛选（类别、时期、材质、类型）
  - 嵌套路由（`/persons/{id}/events`, `/persons/{id}/relations`）

- **数据关联**
  - 外键约束与级联删除
  - 事件与地点关联（location_id）
  - 人物自引用关系网络
  - JSON 字段支持（历史事件、图片数组）

### 技术特性

- **RESTful API**: 遵循 REST 规范，语义化 HTTP 方法
- **标准响应格式**: 统一的 JSON 响应结构（code, message, data）
- **健康检查**: 内置健康状态监控端点
- **SQLite 数据库**: 轻量级数据库，开箱即用，自动初始化
- **中间件支持**:
  - 请求日志记录（方法、路径、耗时）
  - CORS 跨域支持
- **容器化部署**:
  - Docker 多阶段构建优化
  - Cloudflare Tunnel 内网穿透集成（可选）
- **便捷脚本**: 构建、启动、停止、状态查看、资源清理等运维脚本
- **API 测试文件**: 包含 60+ 测试用例的 `.http` 文件

## 🛠 技术栈

- **语言**: Go 1.21
- **Web 框架**: Gorilla Mux v1.8.1
- **数据库**: SQLite3 (go-sqlite3 v1.14.32)
- **容器化**: Docker
- **网络**: Cloudflare Tunnel（可选）

## 📁 项目结构

```
ArtChronicle/
├── main.go                          # 应用入口
├── go.mod                           # Go 模块依赖（module: huangbinhong）
├── go.sum                           # 依赖版本锁定
├── Dockerfile                       # Docker 镜像配置
├── .dockerignore                    # Docker 构建忽略文件
├── .gitignore                       # Git 忽略文件
├── .env                             # 环境变量配置
├── .env.example                     # 环境变量模板
├── api_test.http                    # API 测试文件（60+ 用例）
│
├── handlers/                        # 请求处理器
│   ├── response_helper.go           # 响应辅助函数
│   ├── health_handler.go            # 健康检查
│   ├── person_handler.go            # 人物 CRUD
│   ├── work_handler.go              # 作品 CRUD
│   ├── event_handler.go             # 事件 CRUD（含嵌套路由）
│   ├── location_handler.go          # 地点 CRUD
│   └── relation_handler.go          # 关系 CRUD（含嵌套路由）
│
├── routes/                          # 路由定义
│   └── routes.go                    # 路由配置（含嵌套路由）
│
├── models/                          # 数据模型
│   ├── response.go                  # API 响应结构 + 错误码
│   ├── person.go                    # 人物实体
│   ├── work.go                      # 作品实体
│   ├── event.go                     # 事件实体（含 JSON 字段）
│   ├── location.go                  # 地点实体
│   └── relation.go                  # 关系实体
│
├── middleware/                      # 中间件
│   └── middleware.go                # 日志和 CORS 中间件
│
├── database/                        # 数据库管理
│   ├── db.go                        # SQLite 初始化逻辑
│   ├── schema.sql                   # 数据库表结构（5张表）
│   ├── seed_huangbinhong_works.sql  # 黄宾虹作品数据（332条）
│   └── seed_huangbinhong_events.sql # 黄宾虹事件数据（55条）
│
├── import_excel_to_sql.py           # Excel 转 SQL 导入脚本
│
├── data/                            # 数据存储
│   └── myapp.db                     # SQLite 数据库文件（自动生成）
│
├── build.sh                         # 构建 Docker 镜像
├── run.sh                           # 启动服务
├── status.sh                        # 查看 Docker 状态
├── stop.sh                          # 停止服务
├── clean.sh                         # 清理 Docker 资源
│
└── 设计文档/
    ├── 数据库结构设计文档.md         # 数据库设计详细说明
    └── 接口设计.md                  # API 接口设计规范
```

## 🚀 快速开始

### 前置要求

- **Docker**（推荐，用于容器化部署）
- **Go 1.21** 或更高版本（可选，仅本地开发需要）

### 方式一：使用便捷脚本（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd ArtChronicle

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置端口、数据路径等（使用默认值即可快速开始）

# 3. 构建 Docker 镜像（会自动更新 Go 依赖）
./build.sh

# 4. 启动服务（自动初始化数据库、插入示例数据）
./run.sh

# 5. 查看服务状态
./status.sh

# 6. 测试 API
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/persons
```

**服务地址**: `http://localhost:8080`（端口可在 .env 中配置）

**环境变量说明（.env 文件）：**
| 变量名 | 必填 | 示例值 | 说明 |
|--------|------|--------|------|
| `PORT` | ✅ | `8080` | 服务监听端口 |
| `DATA_PATH` | ✅ | `./data` | 数据目录路径 |
| `DATABASE_PATH` | ✅ | `/app/data/myapp.db` | SQLite 数据库文件路径（容器内） |
| `CORS_ALLOW_ORIGIN` | ❌ | `*` | CORS 允许的来源（默认 `*` 全部允许） |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ | - | Cloudflare Tunnel Token（内网穿透） |

**其他脚本命令：**
- `./stop.sh` - 停止服务（可选择删除容器）
- `./clean.sh` - 清理 Docker 资源（镜像、容器、缓存）
- `./status.sh` - 查看 Docker 详细状态

### 方式二：本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd ArtChronicle

# 2. 安装依赖
go mod download

# 3. 运行项目
go run main.go
```

### 停止服务

```bash
./stop.sh
```

## 📖 API 文档

### 基础信息

- **Base URL**: `http://localhost:8080`
- **API Version**: `/api/v1`
- **Content-Type**: `application/json`

### 标准响应格式

#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "field": "value"
  }
}
```

#### 错误响应
```json
{
  "code": 4041,
  "message": "Person not found"
}
```

#### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 错误码规范

| HTTP 状态码 | code | 描述 |
|------------|------|------|
| 200 | 0 | 成功 |
| 400 | 4001 | 请求参数校验失败 |
| 401 | 4011 | 认证失败/未登录 |
| 403 | 4031 | 无权限访问 |
| 404 | 4041 | 资源不存在 |
| 409 | 4091 | 资源冲突 |
| 500 | 5001 | 内部服务器错误 |

### API 端点总览

#### 1. 健康检查

```http
GET /health
```

#### 2. 人物 (Persons)

```http
GET    /api/v1/persons                    # 列表（支持 search, page, pageSize）
POST   /api/v1/persons                    # 创建
GET    /api/v1/persons/{id}               # 详情
PUT    /api/v1/persons/{id}               # 更新
DELETE /api/v1/persons/{id}               # 删除

# 嵌套路由
GET    /api/v1/persons/{personId}/events      # 获取某人物的所有事件
POST   /api/v1/persons/{personId}/events      # 为某人物创建事件
GET    /api/v1/persons/{personId}/relations   # 获取某人物的所有关系
```

#### 3. 作品 (Works)

```http
GET    /api/v1/works                      # 列表（支持多条件筛选）
POST   /api/v1/works                      # 创建
GET    /api/v1/works/{id}                 # 详情
PUT    /api/v1/works/{id}                 # 更新
DELETE /api/v1/works/{id}                 # 删除
```

**筛选参数**: `category`, `stylePeriod`, `material`, `personId`, `search`

#### 4. 事件 (Events)

```http
GET    /api/v1/events                     # 列表（支持筛选）
POST   /api/v1/events                     # 创建
GET    /api/v1/events/{id}                # 详情
PUT    /api/v1/events/{id}                # 更新
DELETE /api/v1/events/{id}                # 删除
```

**筛选参数**: `personId`, `type`

#### 5. 地点 (Locations)

```http
GET    /api/v1/locations                  # 列表
POST   /api/v1/locations                  # 创建
GET    /api/v1/locations/{id}             # 详情
PUT    /api/v1/locations/{id}             # 更新
DELETE /api/v1/locations/{id}             # 删除
```

#### 6. 关系 (Relations)

```http
GET    /api/v1/relations                  # 列表（支持筛选）
POST   /api/v1/relations                  # 创建
GET    /api/v1/relations/{id}             # 详情
PUT    /api/v1/relations/{id}             # 更新
DELETE /api/v1/relations/{id}             # 删除
```

**筛选参数**: `type`, `personId`

### API 数据状态说明

当前数据库中各端点的数据情况：

| API 端点 | 数据状态 | 记录数 | 说明 |
|---------|---------|--------|------|
| `GET /api/v1/persons` | ✅ 有数据 | 1 | 黄宾虹完整信息 |
| `GET /api/v1/persons/1` | ✅ 正常 | - | 返回黄宾虹详情 |
| `GET /api/v1/works` | ✅ 有数据 | 332 | 黄宾虹书法作品（含完整字段）|
| `GET /api/v1/works/{id}` | ✅ 正常 | - | 支持 ID 1-332 |
| `GET /api/v1/events` | ✅ 有数据 | 55 | 黄宾虹生平事件 |
| `GET /api/v1/events/{id}` | ✅ 正常 | - | 支持 ID 1-55 |
| `GET /api/v1/locations` | ⚪ 空表 | 0 | 可通过 POST 添加 |
| `GET /api/v1/locations/{id}` | ❌ 404 | - | 表为空，返回 404 |
| `GET /api/v1/relations` | ⚪ 空表 | 0 | 可通过 POST 添加 |
| `GET /api/v1/relations/{id}` | ❌ 404 | - | 表为空，返回 404 |

**嵌套路由**:
- `GET /api/v1/persons/1/events` ✅ 返回 55 条事件
- `GET /api/v1/persons/1/relations` ✅ 返回空数组（无关系数据）

### 使用 API 测试文件

项目包含完整的 `api_test.http` 文件，内含测试用例，已根据当前数据库状态更新。

#### VSCode 使用方法

1. 安装 **REST Client** 插件
2. 打开 `api_test.http` 文件
3. 点击请求上方的 `Send Request` 链接

#### IntelliJ IDEA / WebStorm 使用方法

1. 直接打开 `api_test.http` 文件
2. 点击请求左侧的 ▶️ 按钮

### API 示例

#### 获取人物列表

```bash
curl "http://localhost:8080/api/v1/persons?page=1&pageSize=10"
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "person_id": 1,
        "name": "黄宾虹",
        "alias": "宾虹",
        "birth_date": "1865-01-27T00:00:00Z",
        "death_date": "1955-03-25T00:00:00Z",
        "biography": "黄宾虹，浙江金华人，近现代山水画家...",
        "created_at": "2025-11-19T06:56:16Z",
        "updated_at": "2025-11-19T06:56:16Z"
      }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 获取作品详情（含完整字段）

```bash
curl http://localhost:8080/api/v1/works/1
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "work_id": 1,
    "person_id": 1,
    "title": ""识字一首"书法横幅",
    "category": "书法",
    "style_period": "",
    "creation_year": "公元 2009 年",
    "dimensions": "72×23　厘米",
    "seal": "黄宾虹",
    "inscription": "识字一首。经典通假行，形声各乳孳...",
    "creation_date": "2009-01-01T00:00:00Z",
    "work_image_url": "http://baike.shufami.com/datafile/sc/ap/2010/06/29/X2011021412141745061.jpg",
    "created_at": "2025-11-25T07:00:37Z",
    "updated_at": "2025-11-25T07:00:37Z"
  }
}
```

#### 创建作品（书法作品）

```bash
curl -X POST http://localhost:8080/api/v1/works \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": 1,
    "title": "行书七言联",
    "category": "书法",
    "creation_year": "公元 1940 年",
    "dimensions": "136×34 厘米",
    "seal": "黄宾虹印",
    "inscription": "云山烟霭千峰秀，水绿花红万木春。",
    "material": "纸本墨笔",
    "creation_date": "1940-01-01",
    "work_image_url": "http://example.com/image.jpg"
  }'
```

#### 获取人物的所有事件

```bash
curl http://localhost:8080/api/v1/persons/1/events
```

## 🗄 数据库设计

### 数据库概览

项目使用 **SQLite3** 数据库，包含 **5 张核心表**：

1. **persons** - 人物表
2. **works** - 作品表
3. **events** - 生平事件表
4. **locations** - 地点表
5. **relations** - 人际关系表

### 表结构

#### 1. persons（人物表）

| 字段 | 类型 | 说明 |
|------|------|------|
| person_id | INTEGER | 主键，自增 |
| name | VARCHAR(100) | 姓名（必填） |
| alias | VARCHAR(100) | 别名/号 |
| birth_date | DATE | 出生日期 |
| death_date | DATE | 去世日期 |
| biography | TEXT | 生平简介 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**索引**: `name`, `alias`（支持模糊搜索）

#### 2. works（作品表）

| 字段 | 类型 | 说明 |
|------|------|------|
| work_id | INTEGER | 主键，自增 |
| person_id | INTEGER | 作者ID（外键） |
| title | VARCHAR(255) | 作品标题（必填） |
| category | VARCHAR(50) | 类别（画作/书法） |
| style_period | VARCHAR(50) | 创作时期（早期/中期/晚期） |
| creation_year | VARCHAR(50) | **创作年代**（原始文本，如"公元 2009 年"）|
| dimensions | VARCHAR(100) | **尺寸**（如"72×23 厘米"）|
| seal | TEXT | **钤印**（印章款识）|
| inscription | TEXT | **款识**（题字内容）|
| material | VARCHAR(100) | 材质媒介 |
| creation_date | DATE | 创作日期（标准化格式） |
| description | TEXT | 作品描述 |
| work_image_url | VARCHAR(255) | **图片网址**（完整 URL）|
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**外键**: `person_id` → `persons.person_id` (ON DELETE CASCADE)
**索引**: `person_id`, `category`, `style_period`, `material`, `title`

**书法作品专属字段说明**:
- `creation_year`: 保存原始创作年代文本，便于展示
- `dimensions`: 作品尺寸（长×宽）
- `seal`: 钤印内容（印章文字）
- `inscription`: 款识（题写的文字内容）
- `work_image_url`: 作品图片网址（使用外部图片链接）

#### 3. events（生平事件表）

| 字段 | 类型 | 说明 |
|------|------|------|
| event_id | INTEGER | 主键，自增 |
| person_id | INTEGER | 所属人物ID（外键） |
| location_id | INTEGER | 地点ID（外键，可为空） |
| event_date | DATE | 事件日期 |
| title | VARCHAR(255) | 事件标题（必填） |
| description | TEXT | 简短描述 |
| type | VARCHAR(50) | 事件类型（birth/study/travel...） |
| location | VARCHAR(100) | 地点名称（冗余字段） |
| period | VARCHAR(50) | 时期（早年/中年/晚年） |
| detailed_content | TEXT | 详细内容 |
| historical_events | TEXT | 历史事件（JSON数组） |
| images | TEXT | 图片信息（JSON数组） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**外键**:
- `person_id` → `persons.person_id` (ON DELETE CASCADE)
- `location_id` → `locations.location_id` (ON DELETE SET NULL)

**索引**: `person_id`, `location_id`, `event_date`, `type`

#### 4. locations（地点表）

| 字段 | 类型 | 说明 |
|------|------|------|
| location_id | INTEGER | 主键，自增 |
| name | VARCHAR(100) | 地点名称（必填） |
| latitude | REAL | 纬度 |
| longitude | REAL | 经度 |
| description | VARCHAR(255) | 描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**索引**: `name`

#### 5. relations（人际关系表）

| 字段 | 类型 | 说明 |
|------|------|------|
| relation_id | INTEGER | 主键，自增 |
| from_person_id | INTEGER | 起始人物ID（外键） |
| to_person_id | INTEGER | 目标人物ID（外键） |
| relation_type | VARCHAR(50) | 关系类型（朋友/师生...） |
| description | TEXT | 关系描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**外键**:
- `from_person_id` → `persons.person_id` (ON DELETE CASCADE)
- `to_person_id` → `persons.person_id` (ON DELETE CASCADE)

**唯一约束**: `(from_person_id, to_person_id, relation_type)`
**索引**: `from_person_id`, `to_person_id`, `relation_type`

### 实体关系图 (ER Diagram)

```
┌──────────┐
│ Persons  │───┐
└──────────┘   │
      │        │ 1:N
      │ 1:N    │
      ▼        ▼
┌──────────┐ ┌──────────┐
│  Works   │ │  Events  │───┐
└──────────┘ └──────────┘   │ N:1
                │            │
                │ N:1        ▼
                │      ┌──────────┐
                └─────▶│Locations │
                       └──────────┘

┌──────────┐
│Relations │ (自引用 M:N)
└──────────┘
   │    │
   └────┘ (from_person ↔ to_person)
```

### 数据库初始数据

数据库初始化时会自动加载黄宾虹相关数据：

- **1 位人物**: 黄宾虹（完整生平信息）
- **332 件作品**: 黄宾虹书法作品（包含创作年代、尺寸、钤印、款识、图片网址等完整字段）
- **55 个事件**: 黄宾虹生平事件（从出生到晚年，包含同时期历史事件背景）
- **0 个地点**: 暂无（可通过 API 添加）
- **0 个关系**: 暂无（可通过 API 添加）

**数据来源**: Excel 文件自动导入
- 作品数据: `332项黄宾虹书法作品.xlsx`
- 事件数据: `黄宾虹年份事件与历史事件.xlsx`

### 数据库文件位置

- **容器内路径**: `/app/data/myapp.db`
- **宿主机挂载**: `./data/myapp.db`

## 🔧 中间件

### 日志中间件

自动记录所有 HTTP 请求的详细信息：
- 请求方法 (GET, POST, PUT, DELETE)
- 请求路径
- 客户端 IP
- 处理耗时

**示例日志**:
```
2025/11/19 06:53:04 [GET] /api/v1/persons 172.19.0.1:47246
2025/11/19 06:53:04 Request completed in 491.416µs
```

### CORS 中间件

支持跨域请求，配置如下：
- **允许来源**: `*`（所有来源）
- **允许方法**: GET, POST, PUT, DELETE, OPTIONS
- **允许头部**: Content-Type, Authorization

## 👨‍💻 开发指南

### 添加新的 API 端点

#### 1. 创建数据模型

在 `models/` 目录创建新的模型文件：

```go
// models/book.go
package models

import "time"

type Book struct {
    BookID      int       `json:"book_id"`
    Title       string    `json:"title"`
    Author      string    `json:"author"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

type BookCreateRequest struct {
    Title  string `json:"title" binding:"required"`
    Author string `json:"author" binding:"required"`
}
```

#### 2. 创建处理器

在 `handlers/` 目录创建处理器：

```go
// handlers/book_handler.go
package handlers

import (
    "net/http"
    "show/database"
    "show/models"
)

func GetBooks(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()
    // ... 实现逻辑
    SuccessResponse(w, books)
}
```

#### 3. 注册路由

在 `routes/routes.go` 中注册路由：

```go
api.HandleFunc("/books", handlers.GetBooks).Methods("GET")
api.HandleFunc("/books", handlers.CreateBook).Methods("POST")
```

### 数据库迁移

#### 修改数据库结构

1. 编辑 `database/schema.sql`
2. 删除旧数据库：`rm data/myapp.db`
3. 重启服务，自动重新初始化

#### 添加示例数据

数据通过以下方式加载：
1. **黄宾虹人物数据**: 在 `database/db.go` 中直接插入
2. **作品和事件数据**: 从 Excel 文件生成 SQL
   - 修改 Excel 文件后，运行 `import_excel_to_sql.py` 重新生成 SQL
   - 重新构建 Docker 镜像并启动服务

### 代码规范

- 遵循 Go 官方代码规范
- 使用 `gofmt` 格式化代码
- 所有公开函数添加注释
- 错误处理使用 `ErrorResponse` 辅助函数
- 成功响应使用 `SuccessResponse` 或 `PaginationResponse`

### 响应辅助函数

```go
// 成功响应
SuccessResponse(w, data)

// 错误响应
ErrorResponse(w, http.StatusBadRequest, "Invalid input")

// 分页响应
PaginationResponse(w, items, total, page, pageSize)

// 删除成功响应
DeleteSuccessResponse(w, "Resource deleted successfully")
```

## 🔍 故障排查

### 数据库连接失败

**问题**: 启动时报错 "unable to open database file"

**解决方案**:
```bash
# 确保 data 目录存在且有写入权限
mkdir -p data
chmod 755 data
```

### 端口被占用

**问题**: 8080 端口已被占用

**解决方案**:

方法1：修改 `.env` 文件
```bash
PORT=8081
```

方法2：使用环境变量
```bash
PORT=8081 go run main.go
```

方法3：修改 `.env` 文件
```bash
PORT=8081
```

### Docker 构建失败

**问题**: Docker 构建报错或缓存问题

**解决方案**:
```bash
# 停止并删除容器
./stop.sh

# 清理 Docker 资源
./clean.sh

# 删除旧数据库（可选）
rm -f data/myapp.db

# 重新构建并运行
./build.sh
./run.sh
```

### 数据库表结构不正确

**问题**: 修改了 schema.sql 但表结构未更新

**解决方案**:
```bash
# 停止服务
./stop.sh

# 删除旧数据库
rm -f data/myapp.db

# 重新启动，自动重新初始化
./run.sh
```

### API 返回 404

**问题**: 请求路径正确但返回 404

**可能原因**:
1. 路由未正确注册
2. HTTP 方法不匹配（GET vs POST）
3. 路径参数错误（`/api/v1/persons/1` vs `/api/v1/persons/one`）

**调试方法**:
```bash
# 查看容器日志
docker logs -f huangbinhong

# 检查已注册的路由
# 在 main.go 中打印路由信息
```

### 外键约束错误

**问题**: 创建记录时报 "FOREIGN KEY constraint failed"

**原因**: 引用的父记录不存在

**解决方案**:
```bash
# 先创建父记录（如 person）
curl -X POST http://localhost:8080/api/v1/persons -d '{"name":"张三"}'

# 再创建子记录（如 work）
curl -X POST http://localhost:8080/api/v1/works -d '{"person_id":1,"title":"画作"}'
```

## 📚 相关文档

- [数据库结构设计文档.md](数据库结构设计文档.md) - 详细的数据库设计说明
- [接口设计.md](接口设计.md) - API 接口设计规范
- [api_test.http](api_test.http) - 完整的 API 测试用例集

## 📝 环境配置

项目使用 `.env` 文件管理环境变量：

```bash
# Cloudflare Tunnel Token
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here

# 应用端口（默认 8080）
PORT=8080
```