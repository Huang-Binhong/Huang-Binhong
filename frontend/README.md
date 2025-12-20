# 黄宾虹艺术作品交互式展示平台

这是一个基于 React 和 FastAPI 构建的交互式艺术展示平台，专注于展示和探索近现代国画大师黄宾虹的艺术作品。项目集成了 AI 技术，提供作品分析、风格迁移等创新功能。

## ✨ 项目特色

- 🎨 **作品展示系统** - 浏览黄宾虹的艺术作品集，支持详细信息查看和高清图片缩放
- 🗺️ **交互式地图** - 通过交互式地图探索黄宾虹的艺术之旅和游历足迹
- 🎯 **时间线展示** - 按时间顺序展示艺术家的创作历程
- 🤖 **AI 艺术讲解** - 从作品详情页进入，火山引擎AI自动分析作品笔法、墨色、构图、题款等特征
- 🎭 **风格迁移** - 上传图片体验黄宾虹风格的 AI 艺术风格迁移
- 🔗 **关系图谱** - 可视化展示艺术家、作品、流派之间的关联关系
- ✨ **精美动画** - 使用 GSAP 和 Framer Motion 打造流畅的交互体验

## 🛠️ 技术栈

### 前端
- **React 19** - UI 框架
- **React Router** - 路由管理
- **Framer Motion** & **GSAP** - 动画效果
- **React Markdown** - Markdown 渲染
- **React Zoom Pan Pinch** - 图片缩放交互

### 后端
- **FastAPI** - Python Web 框架
- **httpx** - HTTP 客户端（用于 AI 服务调用）
- **CORS** - 跨域支持

## 📁 项目结构

```
huang-binhong-unified/
├── src/                      # 前端源代码
│   ├── pages/               # 页面组件
│   │   ├── HomePage.js              # 首页
│   │   ├── ArtworkListPage.js       # 作品列表页
│   │   ├── ArtworkDetailPage.js     # 作品详情页
│   │   ├── StyleTransferPage.js     # 风格迁移页
│   │   ├── AIExplanationPage.js     # AI 分析页
│   │   ├── JourneyMapPage.js        # 艺术地图页
│   │   └── RelationshipPage.js      # 关系图谱页
│   ├── components/          # 可复用组件
│   │   ├── ArtworkViewer.js         # 作品查看器
│   │   ├── InteractiveMap.js        # 交互式地图
│   │   ├── Timeline.js              # 时间线
│   │   ├── StoryPanel.js            # 故事面板
│   │   ├── InkParticles.js          # 水墨粒子效果
│   │   └── FlyingBird.js            # 飞鸟动画
│   ├── utils/               # 工具函数
│   │   ├── aiService.js             # AI 服务接口
│   │   └── audioManager.js          # 音频管理
│   └── styles/              # 样式文件
├── backend/                 # 后端代码
│   ├── main.py             # FastAPI 主应用
│   ├── config.py           # 配置管理
│   └── config.json         # 配置文件
└── public/                  # 静态资源
    └── images/             # 图片资源
```

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v16+)
- Python 3.8+
- npm 或 yarn
- 火山引擎 API Key（用于 AI 讲解功能）

### 配置环境变量

1. 复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的火山引擎 API Key：
```env
REACT_APP_ARK_API_KEY=your_actual_api_key_here
```

> 💡 **获取 API Key**: 访问 [火山引擎控制台](https://console.volcengine.com/ark) 注册并获取

### 安装依赖

#### 前端依赖
```bash
npm install
```

#### 后端依赖
```bash
cd backend
pip install fastapi uvicorn httpx python-multipart
```

### 运行项目

#### 启动前端开发服务器
```bash
npm start
```
前端将在 [http://localhost:3000](http://localhost:3000) 运行

#### 启动后端服务器
```bash
cd backend
python main.py
```
或使用 uvicorn:
```bash
uvicorn main:app --reload --port 8000
```
后端 API 将在 [http://localhost:8000](http://localhost:8000) 运行

## 📖 页面功能说明

| 页面 | 路由 | 功能描述 |
|------|------|----------|
| 首页 | `/` | 项目介绍和导航入口 |
| 作品列表 | `/artworks` | 浏览所有作品，支持筛选和搜索 |
| 作品详情 | `/artwork/:id` | 查看单个作品的详细信息，可进入AI讲解 |
| 风格迁移 | `/style-transfer` | 上传图片进行 AI 风格迁移 |
| **AI 讲解** | `/ai-explanation` | **从作品详情页进入，自动加载作品图片，AI智能分析笔法、墨色、构图等** |
| 艺术地图 | `/journey-map` | 交互式地图展示艺术家游历 |
| 关系图谱 | `/relationships` | 可视化艺术关系网络 |
| 时间线 | `/timeline` | 展示艺术家生平和创作历程 |

## 🤖 AI 讲解功能详情

AI 讲解功能使用火山引擎的视觉理解模型，可以智能分析中国书画艺术作品：

### 功能特点
- 🎯 **智能关联**: 从作品详情页直接进入，自动加载作品图片
- 🧠 **深度分析**: AI深度理解艺术作品的笔法、墨色、构图
- 📝 **专业解读**: 生成包含题款、印章、背景故事的详细分析
- 🔄 **流畅导航**: 智能返回按钮，回到原作品详情页
- 🎨 **中国风设计**: 精美的界面设计，呼应艺术主题

### 使用步骤
1. 从首页点击"观看" → "作品全览"
2. 选择任意作品进入作品详情页
3. 点击"AI艺术讲解"按钮（作品图片自动加载）
4. 点击"AI智能分析"按钮
5. 等待5-15秒，查看AI生成的专业艺术解读
6. 点击"返回作品详情"回到原作品页面

### 技术实现
- **AI模型**: 火山引擎 `doubao-seed-1-6-flash-250828`
- **输出格式**: Markdown（支持标题、列表、引用等）
- **图片处理**: Base64编码传输
- **数据传递**: React Router `location.state` 传递作品信息
- **自动加载**: Fetch API 自动加载作品图片

### 访问控制
- ⚠️ **注意**: AI讲解页面只能从作品详情页进入
- 🔒 直接访问 `/ai-explanation` 会自动重定向到作品列表页
- ✅ 确保与具体作品关联，提供更准确的分析上下文

📚 **详细文档**: 
- [AI讲解功能说明.md](./AI讲解功能说明.md) - 完整功能介绍
- [AI讲解功能测试指南.md](./AI讲解功能测试指南.md) - 测试流程
- [AI讲解功能更新说明.md](./AI讲解功能更新说明.md) - 最新更新内容

## 🧪 测试

运行测试套件：
```bash
npm test
```

## 🏗️ 构建部署

构建生产版本：
```bash
npm run build
```

构建完成后，`build` 文件夹包含可部署的静态文件。

## 🔧 配置说明

### 前端配置
环境变量配置文件位于根目录的 `.env` 文件：
- `REACT_APP_ARK_API_KEY` - 火山引擎 AI API 密钥（必需，用于 AI 讲解功能）
- `REACT_APP_API_URL` - 后端 API 地址（可选）
- `REACT_APP_BACKEND_URL` - 后端服务地址（可选）

### 后端配置
后端配置文件位于 `backend/config.json`，可配置：
- AI 服务 API 端点
- 静态资源路径
- 其他业务配置

## 📝 开发说明

- 使用 Create React App 脚手架创建
- 遵循 React Hooks 编程规范
- 组件采用函数式组件编写
- 样式使用 CSS Modules 或独立 CSS 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目仅用于教育和学习目的。

---

Made with ❤️ for Art & Technology
