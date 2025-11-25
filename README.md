# 游历地图 - 项目文档

## 📋 项目概述

本项目基于 [Create React App](https://github.com/facebook/create-react-app) 构建，通过交互式地图可视化重现一段富有历史文化气息的游历旅程，融合古典美学与现代前端技术，打造沉浸式的历史游历体验。

---

## 🚀 可用脚本

在项目目录中，可运行以下命令：

| 命令              | 描述 |
|-----------------|------|
| `npm install`   | npm 会自动读取 package.json 和 package-lock.json，重新下载所有依赖，生成一个全新的 node_modules 文件夹。                                                                                                      |
| `npm start`     | 启动开发模式<br>打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看<br>修改代码时页面会自动重载<br>控制台会显示 lint 错误 |
| `npm test`      | 启动交互式监视模式的测试运行器<br>详见 [运行测试](https://facebook.github.io/create-react-app/docs/running-tests) |
| `npm run build` | 构建生产版本到 `build` 文件夹<br>优化 React 生产模式打包，提升性能<br>文件会被压缩，文件名包含哈希值<br>应用可直接部署 |
| `npm run eject` | ⚠️ 单向操作，不可撤销！<br>若对构建工具和配置不满意，可执行此命令<br>会将所有配置文件和依赖复制到项目中，便于完全自定义<br>除 `eject` 外的其他命令仍可使用，但指向复制后的脚本 |

---

## 📚 学习资源

- [Create React App 文档](https://facebook.github.io/create-react-app/docs/getting-started)
- [React 官方文档](https://reactjs.org/)
- [代码分割](https://facebook.github.io/create-react-app/docs/code-splitting)
- [包体积分析](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [渐进式 Web 应用](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [高级配置](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [部署指南](https://facebook.github.io/create-react-app/docs/deployment)
- [构建失败问题排查](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## 🎨 页面核心功能介绍

### 1. 动态交互式地图
- **高德地图基底**：页面中心采用高德地图（AMap）作为核心交互画布
- **古风地图叠加**：现代地图之上叠加半透明（opacity: 0.3）古风地图图片（`ancient-map.jpg`），营造历史与现代交融的视觉效果
- **固定视角设计**：地图设置为不可拖动、不可缩放，确保用户聚焦于核心叙事内容
- **古典装饰元素**：地图四角配有古典纹样装饰（`corner-tl-ornate.svg`、`corner-tr-ornate.svg` 等），强化古典美学风格

### 2. “毛笔”动画轨迹
- **精致 SVG 毛笔图标**：
    - 包含笔杆木材质感、高光细节
    - 笔头羊毫纹理与墨迹效果
    - 内置墨滴呼吸动画，提升生动性
- **动态移动效果**：
    - 切换章节时，毛笔图标沿预设路径（`journey.path`）平滑移动，模拟真实游历过程
    - 无预设路径时，直接定位至目标地点，保证交互流畅性

### 3. 地点标记与交互
- **优化布局设计**：通过 `adjustedPositions` 对象微调部分地点（金华、歙县、上海等）坐标，避免标记遮挡
- **自定义标记样式**：
    - 圆形图标+地点首字的简洁设计
    - 配套文字标签，清晰标识地点名称
- **点击交互功能**：点击任意地点标记触发 `onLocationClick` 事件，通常用于展示该地点详细信息

### 4. 旅程序列指示器
- **实时信息展示**：地图左上角的 `journey-indicator` 信息框，动态显示当前章节的年份与地点
- **优雅过渡动画**：基于 framer-motion 实现淡入淡出+位移动画，章节切换时状态转换自然流畅