风地图背景设置
==================

快速开始：
---------
1. 将古风地图图片命名为：ancient-map.jpg
2. 放置在此文件夹（src/assets/）
3. 刷新页面，切换到"古地图"模式查看效果

图片要求：
---------
- 格式：JPG（推荐）或 PNG
- 尺寸：1920x1080 或更高
- 大小：< 3MB
- 风格：古代中国地图、山海经风格、手绘地图

推荐资源：
---------
1. 故宫博物院数字文物库
   https://digicol.dpm.org.cn/
   
2. 中国国家图书馆古籍资源
   http://www.nlc.cn/
   
3. 维基共享资源
   https://commons.wikimedia.org/
   搜索：Ancient Chinese Map

当前配置：
---------
- 透明度：35%（不遮挡地图内容）
- 层级：最底层（不影响交互）
- 显示：仅在"古地图"模式下显示

调整透明度：
-----------
如需调整，编辑 src/components/InteractiveMap.css
找到 .ancient-map-background
修改 opacity 值（0.2-0.5 之间）

效果说明：
---------
✓ 不遮挡地点圆点
✓ 不遮挡轨迹线
✓ 不遮挡毛笔标记
✓ 不影响地图交互
✓ 增强古风氛围

详细说明请查看：ANCIENT_MAP_GUIDE.md
