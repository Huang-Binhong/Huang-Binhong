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
如需 AI 功能，复制 `.env.example` 为 `.env` 并配置 `REACT_APP_ARK_API_KEY`。

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
