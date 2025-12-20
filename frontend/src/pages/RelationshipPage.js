import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './RelationshipPage.css';
import paperBg from '../images/rice_paper_bg.jpg';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const typeColors = {
  '父子': '#A83C32',
  '母子': '#A83C32',
  '父女': '#A83C32',
  '夫妻': '#D4A574',
  '师生': '#5B8E7D',
  '同门': '#5B8E7D',
  '朋友': '#B8860B',
  '赞助人与艺术家': '#B8860B',
  'default': '#666666'
};

function RelationshipPage() {
  const canvasRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [currentBg, setCurrentBg] = useState(0);
  const [persons, setPersons] = useState([]);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 从后端获取数据
    const fetchData = async () => {
      setLoading(true);
      try {
        const [personsRes, relationsRes] = await Promise.all([
          fetch(`${API_BASE}/api/persons`),
          fetch(`${API_BASE}/api/relations`)
        ]);
        const personsData = await personsRes.json();
        const relationsData = await relationsRes.json();

        setPersons(personsData.persons || []);
        setRelations(relationsData.relations || []);
      } catch (error) {
        console.error('获取关系数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || persons.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight - 200;

    // 找到黄宾虹作为中心节点
    const huangBinhong = persons.find(p => p.name === '黄宾虹') || persons[0];

    // 中心节点
    const centerNode = {
      id: huangBinhong.person_id,
      name: huangBinhong.name,
      desc: huangBinhong.biography || '近现代画家、学者，擅长山水画，为山水画一代宗师',
      type: 'center',
      x: width / 2,
      y: height / 2,
      radius: 60
    };

    // 获取与黄宾虹相关的人物
    const personRelations = [];
    relations.forEach(rel => {
      if (rel.from_person_id === huangBinhong.person_id) {
        personRelations.push({ personId: rel.to_person_id, type: rel.relation_type, desc: rel.description });
      } else if (rel.to_person_id === huangBinhong.person_id) {
        personRelations.push({ personId: rel.from_person_id, type: rel.relation_type, desc: rel.description });
      }
    });

    // 初始布局：将节点大致放置在螺旋线上
    const totalRelationNodes = personRelations.length;
    const maxRadius = Math.min(width, height) / 2;
    const safeMaxRadius = maxRadius - 80;
    const startRadius = Math.max(150, safeMaxRadius * 0.3);
    const endRadius = safeMaxRadius;

    const relationNodes = [];
    personRelations.forEach((pr, index) => {
      const person = persons.find(p => p.person_id === pr.personId);
      if (!person) return;

      const angle = (index / totalRelationNodes) * Math.PI * 2;
      const distance = totalRelationNodes > 1
        ? startRadius + (endRadius - startRadius) * (index / (totalRelationNodes - 1))
        : startRadius;
      const radius = 35;

      relationNodes.push({
        id: person.person_id,
        name: person.name,
        relation: pr.type,
        type: pr.type,
        desc: pr.desc || person.biography || '',
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        radius
      });
    });

    // 力导向算法：迭代调整位置以消除重叠
    const allNodes = [centerNode, ...relationNodes];
    const iterations = 100;
    const repulsion = 1.0;
    const attraction = 0.01;

    for (let i = 0; i < iterations; i++) {
      // 计算节点间的排斥力
      for (let j = 0; j < allNodes.length; j++) {
        for (let k = j + 1; k < allNodes.length; k++) {
          const nodeA = allNodes[j];
          const nodeB = allNodes[k];

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSquared = dx * dx + dy * dy;

          if (distSquared > 1) {
            const dist = Math.sqrt(distSquared);
            const minDistance = nodeA.radius + nodeB.radius + 25;

            if (dist < minDistance) {
              const overlap = minDistance - dist;
              const force = overlap * 0.5 * repulsion;
              const forceX = (dx / dist) * force;
              const forceY = (dy / dist) * force;

              if (nodeA.type !== 'center') {
                nodeA.x -= forceX;
                nodeA.y -= forceY;
              }
              if (nodeB.type !== 'center') {
                nodeB.x += forceX;
                nodeB.y += forceY;
              }
            }
          }
        }
      }

      // 向心力
      for (const node of relationNodes) {
        const dx = centerNode.x - node.x;
        const dy = centerNode.y - node.y;
        node.x += dx * attraction;
        node.y += dy * attraction;
      }
    }

    // 绘制函数
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 绘制连线
      relationNodes.forEach(node => {
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(node.x, node.y);
        const color = typeColors[node.type] || typeColors.default;
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 绘制节点
      const drawNode = (node) => {
        const isCenter = node.type === 'center';
        const isHovered = hoveredPerson && hoveredPerson.name === node.name;

        ctx.beginPath();

        // 悬停时添加金色光晕
        if (isHovered && !isCenter) {
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 20;
        }

        // 悬停时节点稍微变大
        const currentRadius = isHovered && !isCenter ? node.radius + 3 : node.radius;
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);

        // 填充颜色
        const color = isCenter ? '#8B4513' : (typeColors[node.type] || typeColors.default);
        ctx.fillStyle = color;
        ctx.fill();

        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // 绘制描边
        ctx.strokeStyle = '#FAF5E9';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = '#fff';
        ctx.font = `${isCenter ? 20 : 14}px "Ma Shan Zheng", cursive, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      };

      allNodes.forEach(drawNode);
    };

    draw();

    // 处理鼠标交互
    const getCanvasCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      return { x, y };
    };

    const handleMouseMove = (e) => {
      const { x, y } = getCanvasCoordinates(e);

      let found = false;
      for (const node of allNodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < node.radius + 10) {
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
      const { x, y } = getCanvasCoordinates(e);

      for (const node of allNodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < node.radius + 10) {
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
  }, [loading, persons, relations, hoveredPerson]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div
      className="relationship-page"
      style={{ backgroundImage: `url(${BG_IMAGES[currentBg]})` }}
    >
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
            <span className="legend_dot" style={{backgroundColor: typeColors['父子']}}></span>
            <span>家族</span>
          </div>
          <div className="legend_item">
            <span className="legend_dot" style={{backgroundColor: typeColors['师生']}}></span>
            <span>师生</span>
          </div>
          <div className="legend_item">
            <span className="legend_dot" style={{backgroundColor: typeColors['朋友']}}></span>
            <span>友人</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="relationship_canvas"
          style={{ backgroundImage: `url(${paperBg})` }}
        ></canvas>

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
