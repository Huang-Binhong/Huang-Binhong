import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './RelationshipPage.css';

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

const typeColors = {
  teacher: '#C85A54',
  student: '#5B8E7D',
  friend: '#B8860B'
};

function RelationshipPage() {
  const canvasRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight - 200;

    // 中心节点
    const centerNode = {
      ...relationData.center,
      x: width / 2,
      y: height / 2,
      radius: 60
    };

    // 计算周围节点位置
    const relationNodes = relationData.relations.map((person, index) => {
      const angle = (index / relationData.relations.length) * Math.PI * 2;
      const distance = person.size === 'large' ? 250 : person.size === 'medium' ? 350 : 450;
      const radius = person.size === 'large' ? 40 : person.size === 'medium' ? 30 : 20;

      return {
        ...person,
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        radius,
        angle,
        distance
      };
    });

    setNodes([centerNode, ...relationNodes]);

    // 绘制函数
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 绘制连线
      relationNodes.forEach(node => {
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = typeColors[node.type] + '40';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 绘制节点
      const drawNode = (node, isCenter = false) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isCenter ? '#8B4513' : typeColors[node.type];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = '#fff';
        ctx.font = `${isCenter ? 20 : 14}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      };

      relationNodes.forEach(node => drawNode(node));
      drawNode(centerNode, true);
    };

    draw();

    // 处理鼠标交互
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      for (const node of [centerNode, ...relationNodes]) {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (distance < node.radius) {
          setHoveredPerson(node);
          canvas.style.cursor = 'pointer';
          found = true;
          break;
        }
      }

      if (!found) {
        setHoveredPerson(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const node of [centerNode, ...relationNodes]) {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (distance < node.radius) {
          setSelectedPerson(node);
          break;
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="relationship-page">
      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>

      <Link to="/" className="a_home">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      <div className="relationship_content">
        <div className="relationship_header">
          <h1>黄宾虹人物关系图谱</h1>
          <p>探索大师的社交网络与艺术传承</p>
        </div>

        <div className="legend">
          <div className="legend_item">
            <span className="legend_dot" style={{backgroundColor: typeColors.teacher}}></span>
            <span>师友</span>
          </div>
          <div className="legend_item">
            <span className="legend_dot" style={{backgroundColor: typeColors.student}}></span>
            <span>学生</span>
          </div>
          <div className="legend_item">
            <span className="legend_dot" style={{backgroundColor: typeColors.friend}}></span>
            <span>友人</span>
          </div>
        </div>

        <canvas ref={canvasRef} className="relationship_canvas"></canvas>

        {(selectedPerson || hoveredPerson) && (
          <div className="person_info">
            <h3>{(selectedPerson || hoveredPerson).name}</h3>
            {(selectedPerson || hoveredPerson).relation && (
              <p className="relation_type">关系：{(selectedPerson || hoveredPerson).relation}</p>
            )}
            <p className="person_desc">{(selectedPerson || hoveredPerson).desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RelationshipPage;
