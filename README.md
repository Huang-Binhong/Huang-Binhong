# AI艺术讲解系统

本项目是一个基于React的AI艺术作品分析和讲解系统，能够通过AI技术对上传的艺术作品进行智能分析，并提供多维度、多语言风格的讲解。

## 功能特性

- 图片上传功能
- AI智能分析艺术作品
- 三种讲解模式切换（专业版、通俗版、学术版）
- 响应式设计，适配不同设备

## 技术栈

- React
- React Router
- CSS Modules
- 火山引擎AI API

## 快速开始

1. 克隆项目：
   ```
   git clone <项目地址>
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 配置环境变量：
   - 复制 `.env.example` 文件为 `.env`
   - 在 `.env` 文件中设置您的火山引擎AI API密钥：
     ```
     REACT_APP_ARK_API_KEY=your_actual_api_key_here
     ```

4. 启动开发服务器：
   ```
   npm start
   ```

5. 在浏览器中访问 `http://localhost:3000`

## API集成

本项目集成了火山引擎的AI API，用于分析艺术作品图像。API调用示例：

```bash
curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ARK_API_KEY" \
  -d '{
    "model": "doubao-seed-1-6-flash-250828",
    "messages": [
        {
            "content": [
                {
                    "image_url": {
                        "url": "https://ark-project.tos-cn-beijing.ivolces.com/images/view.jpeg"
                    },
                    "type": "image_url"
                },
                {
                    "text": "图片主要讲了什么?",
                    "type": "text"
                }
            ],
            "role": "user"
        }
    ]
}'
```

## 使用说明

1. 访问首页或[/ai](file:///f:/school/%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5/hbhAI/hbhai/src/artwork-info%5Bartwork-info)页面
2. 点击"选择图片"按钮上传艺术作品图片
3. 点击"AI智能分析"按钮开始分析
4. 分析完成后，点击右下角"AI讲解"按钮查看详细分析结果
5. 可在专业版、通俗版、学术版之间切换查看不同深度的分析内容

## 设计规范

- 主色调：墨黑 (#2E2E2E)、墨绿色 (#3B4F3A)、米白 (#F7F5F0)
- 辅助色：金黄 (#D4A451)（用于强调、提示）
- 字体：标题使用"思源黑体"／"Source Han Sans"，正文使用"苹方"／"PingFang SC"
- 按钮样式：圆角 4px，悬停状态颜色稍微变深
- 间距：统一 8px 为基础单位，布局采用其倍数

## 项目结构

```
src/
├── components/
│   ├── AIExplanation.js          # AI讲解组件
│   └── AIExplanationPage.js      # AI讲解页面
├── services/
│   └── aiService.js              # AI服务模块
├── App.js                        # 主应用组件
├── AppWithRouter.js              # 路由组件
└── index.js                      # 应用入口
```

## 开发指南

1. 所有组件使用函数式组件和Hooks
2. 样式遵循设计规范
3. 服务层封装了API调用逻辑
4. 组件间通过props传递数据

## 部署

```
npm run build
```

构建完成后，将生成的`build`目录部署到您的服务器即可。