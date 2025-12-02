# Repository Guidelines

## 项目结构与模块组织
- 页面：`index.html`、`list.html`、`detail_2.html`、`vr.html`
- 静态资源：`css/`、`js/`、`images/`；第三方库：`layer/`
- 后端模拟：`main.py`（FastAPI，提供列表/详情/VR 接口）；根目录挂载为静态目录

## 构建、开发与运行
- 安装依赖（本地调试）：`pip install fastapi uvicorn`
- 启动服务：`uvicorn main:app --reload --port 8000`
- 访问页面：`http://127.0.0.1:8000/index.html`
- 示例接口：`POST /frontend/pg/huang/huang-collection`、`POST /frontend/pg/huang/get-dong-by-id`、`POST /frontend/pg/huang/vr-works`

## 代码风格与命名
- Python：PEP 8；4 空格缩进；文件/模块 `snake_case.py`；变量 `snake_case`；常量 `UPPER_SNAKE_CASE`
- JavaScript：变量/函数 `camelCase`；文件 `kebab-case.js`
- CSS：类名 `kebab-case`；模块化样式，避免全局污染
- HTML：语义化标签；按“结构（HTML）-样式（CSS）-行为（JS）”分离

## 测试规范
- 建议：`pytest` + `httpx`（如新增测试）
- 目录与命名：`tests/`，文件 `test_*.py`
- 目标覆盖率：≥ 80%
- 运行：`pytest -q`

## 提交与 Pull Request
- 提交信息：遵循 Conventional Commits（如：`feat: 列表页支持筛选`、`fix: 修复分页计算`、`docs: 更新运行说明`）
- PR 要求：清晰描述变更与动机、关联 Issue、提供验证步骤与必要截图；说明影响范围与回滚策略

## 安全与配置提示
- CORS 当前为 `*`（便于本地调试）；生产应收敛 `allow_origins`
- 静态资源默认禁用缓存；生产建议由反向代理接管缓存策略
- 忽略临时/构建产物（如 `__pycache__/`）

## 代理/自动化说明
- 本文件适用于仓库根目录及子目录
- 保持目录结构与引用路径不变，避免破坏静态资源链接

