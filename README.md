# 黄宾虹数字艺术展示平台

一个展示近现代国画大师黄宾虹作品与生平的数字化平台，集成了 AI 艺术讲解与风格迁移功能。

## 项目结构

```
huang_bin_hong/
├── backend/                # Go 后端
│   ├── cmd/main.go        # 入口文件
│   ├── internal/
│   │   ├── config/        # 配置加载
│   │   ├── db/            # 数据库操作
│   │   ├── handlers/      # HTTP 处理器
│   │   ├── models/        # 数据模型
│   │   └── services/      # 外部服务（豆包 AI）
│   ├── data/
│   │   ├── datas/         # Excel 数据源
│   │   ├── work/          # 作品图片
│   │   └── huang_bin_hong.db  # SQLite 数据库
│   ├── .env               # 环境变量配置
│   └── .env.example       # 环境变量示例
├── frontend/              # React 前端
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── services/      # API 服务
│   │   ├── utils/         # 工具函数
│   │   └── styles/        # 样式文件
│   ├── public/            # 静态资源
│   ├── .env               # 环境变量配置
│   └── .env.example       # 环境变量示例
└── README.md
```

## 功能特性

- **作品展示**：浏览黄宾虹 163 幅作品，支持分类筛选和详情查看
- **人物关系图谱**：可视化展示黄宾虹与 21 位相关人物的关系网络
- **生平时间线**：展示 68 个人生事件及同期历史背景
- **AI 艺术讲解**：基于豆包大模型的作品智能分析
- **AI 风格迁移**：将用户图片转换为黄宾虹水墨风格
- **水墨动画生成**：基于风格迁移图片生成动态视频

## 快速开始

### 环境要求

- Go 1.21+
- Node.js 18+
- SQLite3

### 后端启动

```bash
cd backend

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入豆包 API Key

# 编译运行
go build -o server ./cmd/main.go
./server
```

go run cmd/main.go

后端启动后监听 `http://localhost:8080`

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动开发服务器
npm start
```

前端启动后访问 `http://localhost:3000`

## API 接口

### 数据接口

| 方法 | 路径                       | 说明       |
| ---- | -------------------------- | ---------- |
| GET  | `/health`                | 健康检查   |
| GET  | `/api/persons`           | 人物列表   |
| GET  | `/api/relations`         | 人物关系   |
| GET  | `/api/events`            | 事件列表   |
| GET  | `/api/works`             | 作品列表   |
| GET  | `/api/timeline/events`   | 时间线数据 |
| GET  | `/api/timeline/carousel` | 轮播图数据 |

### 前端兼容接口

| 方法 | 路径                                    | 说明         |
| ---- | --------------------------------------- | ------------ |
| POST | `/frontend/pg/huang/huang-collection` | 分页作品列表 |
| POST | `/frontend/pg/huang/get-dong-by-id`   | 作品详情     |
| POST | `/frontend/pg/huang/vr-works`         | VR 作品列表  |

### AI 功能接口

| 方法 | 路径                               | 说明            |
| ---- | ---------------------------------- | --------------- |
| POST | `/api/ai/analyze`                | AI 艺术作品分析 |
| POST | `/api/style-transfer/image`      | 图片风格迁移    |
| POST | `/api/style-transfer/video`      | 创建视频任务    |
| GET  | `/api/style-transfer/video/{id}` | 查询视频任务    |

### 静态资源

| 路径               | 说明     |
| ------------------ | -------- |
| `/static/work/*` | 作品图片 |

## 环境变量配置

### 后端 (backend/.env)

```bash
# 服务器配置
SERVER_PORT=8080
DB_PATH=data/huang_bin_hong.db
DATA_DIR=data/datas

# 豆包 AI 配置（必填）
DOUBAO_API_KEY=your_api_key_here

# 图片生成配置
DOUBAO_IMAGE_MODEL=doubao-seedream-4-0-250828
DOUBAO_IMAGE_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations
DOUBAO_IMAGE_SIZE=2K
DOUBAO_IMAGE_WATERMARK=true
DOUBAO_IMAGE_TIMEOUT=60
DOUBAO_BASE_PROMPT=将输入图片迁移为黄宾虹风格...

# 视频生成配置
DOUBAO_VIDEO_MODEL=doubao-seedance-1-0-pro-250528
DOUBAO_VIDEO_TASK_URL=https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks
DOUBAO_VIDEO_QUERY_URL=https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks
DOUBAO_VIDEO_TIMEOUT=60

# AI 分析配置
DOUBAO_CHAT_MODEL=doubao-seed-1-6-flash-250828
DOUBAO_CHAT_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
DOUBAO_CHAT_TIMEOUT=120
DOUBAO_CHAT_PROMPT=请分析这幅艺术作品...
```

### 前端 (frontend/.env)

```bash
REACT_APP_API_URL=http://localhost:8080
REACT_APP_BACKEND_URL=http://localhost:8080
```

## 数据来源

项目数据来自 Excel 文件，首次启动时自动导入 SQLite 数据库：

- `person.xlsx` - 21 位人物信息
- `event.xlsx` - 68 个生平事件
- `relation.xlsx` - 26 条人物关系
- `work.xlsx` - 163 幅作品信息

## 技术栈

### 后端

- Go 1.21
- SQLite3 (go-sqlite3)
- excelize (Excel 读取)

### 前端

- React 19
- React Router
- Ant Design
- Canvas (关系图谱)

### AI 服务

- 火山引擎豆包大模型
  - doubao-seed-1-6-flash (作品分析)
  - doubao-seedream-4-0 (图片生成)
  - doubao-seedance-1-0-pro (视频生成)
