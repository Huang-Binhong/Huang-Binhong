import { useState, useEffect, useRef } from 'react';
import './App.css';

const relationData = {
  center: {
    name: '黄宾虹',
    desc: '近现代画家、学者，擅长山水画，为山水画一代宗师',
    type: 'center'
  },
  relations: [
    // 师友关系 - 深红色系
    { name: '陈师曾', relation: '师友', type: 'teacher', desc: '著名画家、美术教育家', size: 'large' },
    { name: '吴昌硕', relation: '师友', type: 'teacher', desc: '清末民初著名画家、书法家', size: 'large' },
    { name: '康有为', relation: '师友', type: 'teacher', desc: '维新派领袖，书法家', size: 'medium' },
    { name: '蔡元培', relation: '师友', type: 'teacher', desc: '教育家，北大校长', size: 'medium' },
    { name: '王一亭', relation: '师友', type: 'teacher', desc: '画家、实业家、书法家', size: 'medium' },
    { name: '高邕之', relation: '师友', type: 'teacher', desc: '书法家、收藏家', size: 'small' },

    // 学生关系 - 青绿色系
    { name: '傅雷', relation: '学生', type: 'student', desc: '著名翻译家、文艺评论家', size: 'large' },
    { name: '李可染', relation: '学生', type: 'student', desc: '著名画家', size: 'large' },
    { name: '陆俨少', relation: '学生', type: 'student', desc: '山水画大家', size: 'medium' },
    { name: '王伯敏', relation: '学生', type: 'student', desc: '美术史论家', size: 'medium' },
    { name: '顾飞', relation: '学生', type: 'student', desc: '画家', size: 'small' },
    { name: '宋文治', relation: '学生', type: 'student', desc: '画家', size: 'small' },
    { name: '张继馨', relation: '学生', type: 'student', desc: '书法家、画家', size: 'small' },

    // 友人关系 - 棕金色系
    { name: '齐白石', relation: '友人', type: 'friend', desc: '近现代国画大师', size: 'large' },
    { name: '潘天寿', relation: '友人', type: 'friend', desc: '现代画家、美术教育家', size: 'large' },
    { name: '张大千', relation: '友人', type: 'friend', desc: '国画大师', size: 'large' },
    { name: '徐悲鸿', relation: '友人', type: 'friend', desc: '现代画家、美术教育家', size: 'large' },
    { name: '林风眠', relation: '友人', type: 'friend', desc: '画家、美术教育家', size: 'medium' },
    { name: '刘海粟', relation: '友人', type: 'friend', desc: '画家、美术教育家', size: 'medium' },
    { name: '黄君璧', relation: '友人', type: 'friend', desc: '画家', size: 'medium' },
    { name: '溥心畬', relation: '友人', type: 'friend', desc: '画家、书法家', size: 'medium' },
    { name: '于右任', relation: '友人', type: 'friend', desc: '书法家', size: 'small' },
    { name: '沈尹默', relation: '友人', type: 'friend', desc: '书法家', size: 'small' },
    { name: '马一浮', relation: '友人', type: 'friend', desc: '学者、书法家', size: 'small' },
    { name: '叶恭绰', relation: '友人', type: 'friend', desc: '收藏家', size: 'small' },
    { name: '饶宗颐', relation: '友人', type: 'friend', desc: '学者、书画家', size: 'small' },
    { name: '吴湖帆', relation: '友人', type: 'friend', desc: '画家、收藏家', size: 'small' },
  ]
};

// 优化配色方案 - 根据主题要求调整
const typeColors = {
  teacher: '#C85A54',    // 深红棕色
  student: '#5B8E7D',    // 青绿色
  friend: '#B8860B'      // 棕金色
};

const sizeMap = {
  small: 14,
  medium: 21,
  large: 29
};

function App() {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [centerNode, setCenterNode] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const circleRadius = Math.min(canvas.width, canvas.height) * 0.35;

      setCenterNode({
        ...relationData.center,
        x: centerX,
        y: centerY,
        radius: 40,
        color: '#D4A451'
      });

      // 按类型分组
      const grouped = {
        teacher: relationData.relations.filter(r => r.type === 'teacher'),
        student: relationData.relations.filter(r => r.type === 'student'),
        friend: relationData.relations.filter(r => r.type === 'friend')
      };

      const newNodes = [];

      // 为每个类型分配角度范围
      const typeAngles = {
        teacher: { start: 180, range: 120 },
        student: { start: 300, range: 120 },
        friend: { start: 60, range: 240 }
      };

      Object.keys(grouped).forEach(type => {
        const items = grouped[type];
        const { start, range } = typeAngles[type];

        items.forEach((person, index) => {
          const angleStep = range / (items.length + 1);
          const angle = ((start + angleStep * (index + 1)) * Math.PI) / 180;

          // 根据大小调整距离
          const distanceMultiplier = person.size === 'large' ? 0.7 : person.size === 'medium' ? 0.85 : 0.95;
          const distance = circleRadius * distanceMultiplier;

          newNodes.push({
            ...person,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            radius: sizeMap[person.size],
            color: typeColors[type],
            angle: angle
          });
        });
      });

      setNodes(newNodes);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !centerNode || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 应用缩放和偏移
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // 绘制大圆背景
    const circleRadius = Math.min(canvas.width, canvas.height) * 0.35;
    ctx.fillStyle = 'rgba(212, 164, 81, 0.06)';
    ctx.beginPath();
    ctx.arc(centerNode.x, centerNode.y, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // 绘制圆形边框
    ctx.strokeStyle = 'rgba(91, 142, 125, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 绘制连接线
    const filteredNodes = viewMode === 'all' ? nodes : nodes.filter(n => n.type === viewMode);

    filteredNodes.forEach(node => {
      const isHighlighted = hoveredNode === node;
      drawLine(ctx, centerNode, node, isHighlighted);
    });

    // 绘制节点
    filteredNodes.forEach(node => drawNode(ctx, node, false));
    drawNode(ctx, centerNode, true);

    ctx.restore();
  }, [nodes, centerNode, hoveredNode, viewMode, scale, offset]);

  const drawLine = (ctx, from, to, isHighlighted) => {
    ctx.save();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = isHighlighted ? 1 : 0.8;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.restore();
  };

  const drawNode = (ctx, node, isCenter) => {
    const isHovered = hoveredNode === node;
    const scaleNode = isHovered ? 1.2 : 1;
    const radius = node.radius * scaleNode;

    // 光晕效果
    if (isHovered) {
      const glowRadius = 15;
      const gradient = ctx.createRadialGradient(
        node.x, node.y, radius,
        node.x, node.y, radius + glowRadius
      );
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
      gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 圆形背景
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 名字 - 所有节点都显示文字
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isCenter ? '16px' : '11px'} Microsoft YaHei`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, node.x, node.y);
  };

  const isPointInNode = (x, y, node) => {
    const dx = x - node.x;
    const dy = y - node.y;
    const hitRadius = node.radius * 2.5;
    return Math.sqrt(dx * dx + dy * dy) < hitRadius;
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    let found = null;
    const filteredNodes = viewMode === 'all' ? nodes : nodes.filter(n => n.type === viewMode);

    // 先检查周边节点（从小到大，确保小球优先被检测）
    const sortedNodes = [...filteredNodes].sort((a, b) => a.radius - b.radius);
    for (let node of sortedNodes) {
      if (isPointInNode(x, y, node)) {
        found = node;
        break;
      }
    }

    // 如果没找到周边节点，再检查中心节点
    if (!found && centerNode && isPointInNode(x, y, centerNode)) {
      found = centerNode;
    }

    setHoveredNode(found);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    const scaleFactor = newScale / scale;

    setOffset({
      x: x - (x - offset.x) * scaleFactor,
      y: y - (y - offset.y) * scaleFactor
    });
    setScale(newScale);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="container">
      <header>
        <h1>黄宾虹人物关系图谱</h1>
        <p className="tips">滚动鼠标缩放 | 悬停查看详情</p>
      </header>

      <div className="main-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: hoveredNode ? 'pointer' : 'grab' }}
          />
        </div>

        <div className="control-panel">
          <div className="view-buttons">
            <button
              className={viewMode === 'all' ? 'active' : ''}
              onClick={() => setViewMode('all')}
            >
              全部
            </button>
            <button
              className={viewMode === 'teacher' ? 'active' : ''}
              onClick={() => setViewMode('teacher')}
            >
              师友
            </button>
            <button
              className={viewMode === 'student' ? 'active' : ''}
              onClick={() => setViewMode('student')}
            >
              学生
            </button>
            <button
              className={viewMode === 'friend' ? 'active' : ''}
              onClick={() => setViewMode('friend')}
            >
              友人
            </button>
          </div>

          {hoveredNode && (
            <div className="detail-info">
              <h3>{hoveredNode.name}</h3>
              {hoveredNode.relation && (
                <div className="relation-tag">{hoveredNode.relation}</div>
              )}
              <p>{hoveredNode.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
