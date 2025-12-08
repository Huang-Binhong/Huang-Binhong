# 黄宾虹艺术作品交互式展示平台

这是一个基于 React 和 FastAPI 构建的交互式艺术展示平台，专注于展示和探索近现代国画大师黄宾虹的艺术作品。项目集成了 AI 技术，提供作品分析、风格迁移等创新功能。

## ✨ 项目特色

- 🎨 **作品展示系统** - 浏览黄宾虹的艺术作品集，支持详细信息查看和高清图片缩放
- 🗺️ **交互式地图** - 通过交互式地图探索黄宾虹的艺术之旅和游历足迹
- 🎯 **时间线展示** - 按时间顺序展示艺术家的创作历程
- 🤖 **AI 艺术分析** - 利用 AI 技术深度解析作品的艺术特征和风格
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
| 作品详情 | `/artwork/:id` | 查看单个作品的详细信息 |
| 风格迁移 | `/style-transfer` | 上传图片进行 AI 风格迁移 |
| AI 分析 | `/ai-explanation` | AI 解读作品艺术特征 |
| 艺术地图 | `/journey-map` | 交互式地图展示艺术家游历 |
| 关系图谱 | `/relationships` | 可视化艺术关系网络 |

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
