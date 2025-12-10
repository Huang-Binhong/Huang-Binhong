# Repository Guidelines

## 项目结构与模块
- 前端：`src/`（`pages/` 页面、`components/` 通用组件、`utils/` 工具、`styles/` 样式、`assets/` 图片与 SVG）。
- 静态资源：`public/`（基础 HTML、图标、图片、音频）。
- 后端：`backend/`（FastAPI 入口 `main.py`、配置 `config.json`/`config.py`）。
- 参考旧版静态稿：`Huangbinghong - 副本/`（HTML/CSS/JS 与示例图片）。
- 依赖锁：`package-lock.json`；环境样例：`.env.example`。

## 开发、构建与测试
```bash
npm install          # 安装前端依赖
npm start            # 启动前端开发服务器（默认 http://localhost:3000）
npm test             # 运行前端测试（Jest + react-scripts）
npm run build        # 生成生产构建
cd backend && python main.py        # 启动后端（开发）
cd backend && uvicorn main:app --reload --port 8000  # 后端热重载
```
如需 AI 功能，复制 `.env.example` 为 `.env` 并配置所需密钥（见下方“豆包 AI 服务配置”）。

## 豆包 AI 服务配置
- AI 讲解（前端）：`src/utils/aiService.js` 调用 `https://ark.cn-beijing.volces.com/api/v3/chat/completions`，模型 `doubao-seed-1-6-flash-250828`，需 `REACT_APP_ARK_API_KEY`。
- 风格迁移图生图（后端）：接口 `/api/style-transfer/image` 依赖 `DOUBAO_API_KEY`，可按需覆盖 `DOUBAO_IMAGE_MODEL`（默认 `doubao-seedream-4-0-250828`）、`DOUBAO_IMAGE_URL`、`DOUBAO_IMAGE_RESPONSE_FORMAT`（默认 `url`）、`DOUBAO_IMAGE_SIZE`、`DOUBAO_IMAGE_WATERMARK`、`DOUBAO_IMAGE_TIMEOUT`。
- 风格迁移图生视频（后端）：接口 `/api/style-transfer/video` 使用 `DOUBAO_VIDEO_MODEL`（默认 `doubao-seedance-1-0-pro-250528`）和 `DOUBAO_VIDEO_TASK_URL` / `DOUBAO_VIDEO_QUERY_URL`（默认指向 Ark v3 contents/generations，查询 URL 需保留结尾 `/` 以拼接 taskId），同样依赖 `DOUBAO_API_KEY`。
- 基础提示语可通过 `DOUBAO_BASE_PROMPT` 调整；未提供 key 或错误配置会导致 502 返回。

## 代码风格与命名
- 统一使用 2 空格缩进，UTF-8 编码。
- React 函数组件 + Hooks，避免类组件；状态/函数命名用驼峰（`handleClick`、`artworkList`）。
- 文件命名：组件用帕斯卡（`ArtworkViewer.js`），样式与组件同名（`.css`）。
- 样式尽量模块化，复用公共类；保持注释简短、针对复杂逻辑。

## 测试指引
- 测试框架：CRA 默认 Jest + React Testing Library。
- 新组件优先补充渲染与交互用例；异步逻辑添加 mock，避免真实网络。
- 运行 `npm test`，确保本地通过；覆盖率未硬性要求，但修改核心逻辑应补充用例。

## 提交与 Pull Request
- 提交信息建议「类型: 简述」风格（示例：`feat: add ai explanation guard` / `fix: handle image fetch error`）。
- PR 需包含：变更概要、测试结果（命令及结论）、相关截图/录屏（如 UI 变动）、关联 issue/需求编号。
- 避免混入无关格式化；若需要大规模格式化，请单独提交。

## 安全与配置提示
- 不要提交真实密钥；`.env` 仅本地使用。公共配置放 `config.json`，敏感信息走环境变量。
- 前端 AI 调用走 `REACT_APP_ARK_API_KEY`，后端外部调用需遵守 CORS 与超时设置。
- 静态图片/音频放 `public/`，新资源注意体积与版权。
