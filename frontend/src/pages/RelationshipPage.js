import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './RelationshipPage.css';
import paperBg from '../images/rice_paper_bg.jpg';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const FALLBACK_CENTER = {
  name: '黄宾虹',
  desc: '近现代画家、学者，擅长山水画，为山水画一代宗师',
  type: 'center',
};

const typeColors = {
  家人: '#A83C32',
  师门: '#5B8E7D',
  朋友: '#B8860B',
  default: '#666666',
};

const relationTypeOrder = ['家人', '师门', '朋友'];

const groupRelationTypeForLegend = (rawType) => {
  if (!rawType) return 'default';

  const type = String(rawType);

  if (
    type.includes('家') ||
    type.includes('亲') ||
    type.includes('父') ||
    type.includes('母') ||
    type.includes('子') ||
    type.includes('女') ||
    type.includes('夫') ||
    type.includes('妻')
  ) {
    return '家人';
  }

  if (type.includes('师') || type.includes('门') || type.includes('徒') || type.includes('弟子') || type.includes('学生')) {
    return '师门';
  }

  if (type.includes('友') || type.includes('朋') || type.includes('忘年') || type.includes('知己') || type.includes('赞助') || type.includes('资助')) {
    return '朋友';
  }

  if (
    type.includes('同道') ||
    type.includes('同仁') ||
    type.includes('同好') ||
    type.includes('同侪') ||
    type.includes('合作') ||
    type.includes('学术') ||
    type.includes('艺术') ||
    type.includes('切磋') ||
    type.includes('共事')
  ) {
    return '朋友';
  }

  return type;
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const hslToHex = (h, s, l) => {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const stringToColor = (str) => {
  const hue = hashString(str) % 360;
  return hslToHex(hue, 45, 45);
};

const getTypeColor = (type) => {
  if (!type) return typeColors.default;
  return typeColors[type] || stringToColor(type);
};

const getSizeByType = (type) => {
  if (!type) return 'medium';
  if (type.includes('父') || type.includes('母') || type.includes('夫妻')) return 'large';
  if (type.includes('师') || type.includes('同门')) return 'medium';
  if (type.includes('家人')) return 'large';
  return 'small';
};

const renderWithHighlights = (text, highlights, className) => {
  if (!text) return text;

  const uniq = Array.from(new Set((highlights || []).filter(Boolean)))
    .map((t) => String(t))
    .filter((t) => t.length > 0);
  if (uniq.length === 0) return text;

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${uniq.map(escapeRegExp).join('|')})`, 'g');
  const parts = String(text).split(pattern);

  return parts.map((part, i) =>
    uniq.includes(part) ? (
      <span className={className} key={`${part}-${i}`}>
        {part}
      </span>
    ) : (
      part
    ),
  );
};

function RelationshipPage() {
  const canvasRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [currentBg, setCurrentBg] = useState(0);
  const [loading, setLoading] = useState(true);

  const [relationData, setRelationData] = useState({
    center: FALLBACK_CENTER,
    relations: [],
  });

  const [infoBoxPos, setInfoBoxPos] = useState({ x: 0, y: 0, visible: false });

  const hoveredNodeRef = useRef(null);
  const selectedNodeRef = useRef(null);
  const viewRef = useRef({ scale: 1, x: 0, y: 0 });

  const clearSelection = useCallback(() => {
    selectedNodeRef.current = null;
    setSelectedPerson(null);
    setInfoBoxPos((prev) => ({ ...prev, visible: false }));
  }, [setInfoBoxPos, setSelectedPerson]);

  const legendTypes = useMemo(() => {
    const types = new Set();
    for (const rel of relationData.relations) types.add(rel.type);

    return Array.from(types).sort((a, b) => {
      const ai = relationTypeOrder.indexOf(a);
      const bi = relationTypeOrder.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return String(a).localeCompare(String(b), 'zh-Hans-CN');
    });
  }, [relationData.relations]);

  const highlightNames = useMemo(() => {
    const names = new Set();
    if (relationData.center?.name) names.add(relationData.center.name);
    for (const rel of relationData.relations) {
      if (rel?.name) names.add(rel.name);
    }
    return Array.from(names)
      .map((n) => String(n).trim())
      .filter((n) => n.length >= 2)
      .sort((a, b) => b.length - a.length);
  }, [relationData.center?.name, relationData.relations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  useEffect(() => {
    const fetchRelations = async () => {
      setLoading(true);
      try {
        const [personsRes, relationsRes] = await Promise.all([
          fetch(`${API_BASE}/api/persons`),
          fetch(`${API_BASE}/api/relations`),
        ]);

        const personsPayload = await personsRes.json();
        const relationsPayload = await relationsRes.json();

        const persons = personsPayload.persons || [];
        const relations = relationsPayload.relations || [];
        const personsById = new Map(persons.map((p) => [p.person_id, p]));

        const centerPerson =
          persons.find((p) => p.name === FALLBACK_CENTER.name) ||
          persons.find((p) => String(p.name || '').includes(FALLBACK_CENTER.name)) ||
          persons[0] ||
          null;

        const centerId = centerPerson?.person_id;

        const relationsArray = centerId
          ? relations
              .filter((rel) => rel.from_person_id === centerId || rel.to_person_id === centerId)
              .map((rel) => {
                const otherId = rel.from_person_id === centerId ? rel.to_person_id : rel.from_person_id;
                const otherPerson = personsById.get(otherId);
                const otherName =
                  otherPerson?.name ||
                  (rel.from_person_id === centerId ? rel.to_name : rel.from_name) ||
                  '未知';
                const rawType = rel.relation_type || 'default';
                const legendType = groupRelationTypeForLegend(rawType);

                return {
                  id: rel.relation_id,
                  personId: otherId,
                  name: otherName,
                  relation: rawType,
                  relationRaw: rawType,
                  type: legendType,
                  desc: rel.description || otherPerson?.biography || '',
                  size: getSizeByType(rawType),
                };
              })
          : [];

        setRelationData({
          center: {
            name: centerPerson?.name || FALLBACK_CENTER.name,
            desc: centerPerson?.biography || FALLBACK_CENTER.desc,
            type: 'center',
          },
          relations: relationsArray,
        });
      } catch (error) {
        console.error('获取关系数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelations();
  }, []);

  const generateInkBlob = (radius, complexity = 8) => {
    const points = [];
    for (let i = 0; i < complexity; i++) {
      const angle = (i / complexity) * Math.PI * 2;
      const r = radius * (0.85 + Math.random() * 0.3);
      points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight - 100);
    canvas.style.cursor = 'grab';

    hoveredNodeRef.current = null;
    selectedNodeRef.current = null;
    clearSelection();

    const roundRect = (ctx2, x, y, w, h, r) => {
      ctx2.beginPath();
      ctx2.moveTo(x + r, y);
      ctx2.lineTo(x + w - r, y);
      ctx2.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx2.lineTo(x + w, y + h - r);
      ctx2.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx2.lineTo(x + r, y + h);
      ctx2.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx2.lineTo(x, y + r);
      ctx2.quadraticCurveTo(x, y, x + r, y);
      ctx2.closePath();
    };

    const drawInkBlobPath = (ctx2, cx, cy, points, scale = 1) => {
      ctx2.beginPath();
      if (points.length === 0) return;

      const first = points[0];
      const last = points[points.length - 1];
      const startX = ((last.x + first.x) / 2) * scale + cx;
      const startY = ((last.y + first.y) / 2) * scale + cy;

      ctx2.moveTo(startX, startY);

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const midX = ((p1.x + p2.x) / 2) * scale + cx;
        const midY = ((p1.y + p2.y) / 2) * scale + cy;
        ctx2.quadraticCurveTo(p1.x * scale + cx, p1.y * scale + cy, midX, midY);
      }
      ctx2.closePath();
    };

    const centerNode = {
      ...relationData.center,
      x: width / 2,
      y: height / 2,
      radius: 65,
      type: 'center',
      fixed: true,
    };

    const totalRelationNodes = relationData.relations.length;
    const maxRadius = Math.min(width, height) / 2 + 100;
    const safeMaxRadius = maxRadius - 100;
    const startRadius = Math.max(250, safeMaxRadius * 0.45);
    const endRadius = safeMaxRadius + 50;

    const relationNodes = relationData.relations.map((person, index) => {
      const angle = totalRelationNodes > 0 ? (index / totalRelationNodes) * Math.PI * 2 : 0;
      const t = totalRelationNodes > 1 ? index / (totalRelationNodes - 1) : 0.5;
      const distance = startRadius + (endRadius - startRadius) * t;
      const radius = person.size === 'large' ? 48 : person.size === 'medium' ? 38 : 28;

      return {
        ...person,
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius,
        inkPoints: generateInkBlob(radius, 10),
        inkPointsLayer2: generateInkBlob(radius * 0.8, 8),
        phase: Math.random() * Math.PI * 2,
      };
    });

    const allNodes = [centerNode, ...relationNodes];

    const simulationIterations = 300;
    const repulsion = 1.0;
    const attraction = 0.002;
    const damping = 0.6;

    for (let k = 0; k < simulationIterations; k++) {
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const nodeA = allNodes[i];
          const nodeB = allNodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = nodeA.radius + nodeB.radius + 50;
          if (dist < minDist) {
            const force = (minDist - dist) * repulsion;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (!nodeA.fixed) {
              nodeA.vx -= fx;
              nodeA.vy -= fy;
            }
            if (!nodeB.fixed) {
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
      }

      for (const node of relationNodes) {
        const dx = centerNode.x - node.x;
        const dy = centerNode.y - node.y;
        node.vx += dx * attraction;
        node.vy += dy * attraction;
      }

      for (const node of allNodes) {
        if (node.fixed) continue;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
      }
    }

    let animationFrameId;
    let isDragging = false;
    let dragNode = null;
    let time = 0;

    const tick = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const { scale } = viewRef.current;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);

      const hovered = hoveredNodeRef.current;
      const selected = selectedNodeRef.current;

      relationNodes.forEach((node) => {
        const isConnected = hovered && (hovered === node || hovered === centerNode);
        const shouldDim = hovered && !isConnected;

        ctx.globalAlpha = shouldDim ? 0.05 : isConnected ? 0.9 : 0.3;

        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);

        const midX = (centerNode.x + node.x) / 2;
        const midY = (centerNode.y + node.y) / 2;
        const offset = 30 * (node.radius % 2 === 0 ? 1 : -1);

        ctx.quadraticCurveTo(midX + offset, midY + offset, node.x, node.y);

        const color = getTypeColor(node.type);
        const gradient = ctx.createLinearGradient(centerNode.x, centerNode.y, node.x, node.y);
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(0.2, color);
        gradient.addColorStop(0.8, color);
        gradient.addColorStop(1, `${color}00`);

        ctx.strokeStyle = gradient;
        const breathingWidth = isConnected ? 4 + Math.sin(time * 2) : 2;
        ctx.lineWidth = breathingWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.globalAlpha = 1;
      });

      allNodes.forEach((node) => {
        const isHovered = hovered === node;
        const isSelected = selected === node;
        const isCenter = node.type === 'center';
        const shouldDim = hovered && hovered !== node && hovered !== centerNode && node !== centerNode;

        ctx.globalAlpha = shouldDim ? 0.2 : 1;

        if (isCenter) {
          const sealSize = node.radius * 2;
          const x = node.x - node.radius;
          const y = node.y - node.radius;

          if (isHovered || isSelected) {
            ctx.shadowColor = '#D4AF37';
            ctx.shadowBlur = 20 + Math.sin(time * 3) * 5;
          } else {
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 10;
          }

          const sealGrad = ctx.createLinearGradient(x, y, x + sealSize, y + sealSize);
          sealGrad.addColorStop(0, '#d63031');
          sealGrad.addColorStop(1, '#a92324');
          ctx.fillStyle = sealGrad;

          roundRect(ctx, x, y, sealSize, sealSize, 6);
          ctx.fill();

          ctx.shadowBlur = 0;

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 36px "Ma Shan Zheng", cursive';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, node.x, node.y);

          ctx.strokeStyle = 'rgba(100, 20, 20, 0.5)';
          ctx.lineWidth = 2;
          roundRect(ctx, x + 5, y + 5, sealSize - 10, sealSize - 10, 4);
          ctx.stroke();
        } else {
          const s = 1 + Math.sin(time + node.phase) * 0.03;
          const color = getTypeColor(node.type);

          if (isHovered || isSelected) {
            ctx.fillStyle = `${color}33`;
            drawInkBlobPath(ctx, node.x, node.y, node.inkPoints, s * 1.3);
            ctx.fill();
          }

          ctx.fillStyle = `${color}aa`;
          drawInkBlobPath(ctx, node.x, node.y, node.inkPoints, s);
          ctx.fill();

          ctx.fillStyle = color;
          drawInkBlobPath(ctx, node.x, node.y, node.inkPointsLayer2, s * 0.7);
          ctx.fill();

          if (isHovered || isSelected) {
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 1.5;
            drawInkBlobPath(ctx, node.x, node.y, node.inkPoints, s * 1.1);
            ctx.stroke();
          }

          ctx.fillStyle = '#fff';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 3;
          ctx.font = `${node.size === 'large' ? 22 : 16}px "Ma Shan Zheng", cursive`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, node.x, node.y);
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const getWorldPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const { scale } = viewRef.current;
      const worldX = (mouseX - width / 2) / scale + width / 2;
      const worldY = (mouseY - height / 2) / scale + height / 2;

      return { x: worldX, y: worldY };
    };

    const getScreenPos = (node) => {
      const { scale } = viewRef.current;
      const rect = canvas.getBoundingClientRect();

      const centerX = width / 2;
      const centerY = height / 2;

      const canvasX = (node.x - centerX) * scale + centerX;
      const canvasY = (node.y - centerY) * scale + centerY;

      const cssScaleX = rect.width / width;
      const cssScaleY = rect.height / height;

      const screenCenterX = rect.left + canvasX * cssScaleX;
      const screenCenterY = rect.top + canvasY * cssScaleY;

      const visualRadius = node.radius * scale * cssScaleX * 1.8;

      return { x: screenCenterX, y: screenCenterY, radius: visualRadius };
    };

    const updateInfoBox = (node) => {
      if (!node) return;
      const pos = getScreenPos(node);
      const isRightHalf = pos.x > window.innerWidth / 2;

      setInfoBoxPos({
        x: isRightHalf ? pos.x - pos.radius : pos.x + pos.radius,
        y: pos.y,
        visible: true,
        side: isRightHalf ? 'left' : 'right',
      });
    };

    const handleMouseDown = (e) => {
      const { x, y } = getWorldPos(e);
      let hit = false;
      for (const node of allNodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < node.radius + 10) {
          hit = true;
          if (!node.fixed) {
            isDragging = true;
            dragNode = node;
          }
          selectedNodeRef.current = node;
          setSelectedPerson(node);
          updateInfoBox(node);
          break;
        }
      }

      if (!hit) {
        isDragging = false;
        dragNode = null;
        canvas.style.cursor = 'grab';
        clearSelection();
      }
    };

    const handleMouseMove = (e) => {
      const { x, y } = getWorldPos(e);

      if (isDragging && dragNode) {
        dragNode.x = x;
        dragNode.y = y;

        updateInfoBox(dragNode);
        canvas.style.cursor = 'grabbing';
        return;
      }

      let found = null;
      for (const node of allNodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        if (dist < node.radius + 10) {
          found = node;
          break;
        }
      }

      if (found) {
        canvas.style.cursor = 'pointer';
        if (hoveredNodeRef.current !== found) {
          hoveredNodeRef.current = found;
        }
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        if (hoveredNodeRef.current !== null) {
          hoveredNodeRef.current = null;
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        dragNode = null;
        canvas.style.cursor = 'grab';
      }
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        dragNode = null;
        canvas.style.cursor = 'grab';
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;

      let newScale = viewRef.current.scale + delta;
      newScale = Math.min(Math.max(0.5, newScale), 3.0);
      viewRef.current.scale = newScale;

      if (selectedNodeRef.current) updateInfoBox(selectedNodeRef.current);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [clearSelection, relationData]);

  if (loading && relationData.relations.length === 0) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="relationship-page" style={{ backgroundImage: `url(${BG_IMAGES[currentBg]})` }}>
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
          {legendTypes.map((t) => (
            <div className="legend_item" key={t}>
              <span className="legend_dot" style={{ backgroundColor: getTypeColor(t) }}></span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <canvas
          ref={canvasRef}
          className="relationship_canvas"
          style={{ backgroundImage: `url(${paperBg})` }}
        ></canvas>

        {selectedPerson && infoBoxPos.visible && (
          <div
            className="person_info"
            style={{
              left: infoBoxPos.x,
              top: infoBoxPos.y,
              transform: `translate(${infoBoxPos.side === 'left' ? 'calc(-100% - 30px)' : '30px'}, -50%)`,
            }}
          >
            <h3>{selectedPerson.name}</h3>
            {selectedPerson.relation && (
              <p className="relation_type">关系：{selectedPerson.relationRaw || selectedPerson.relation}</p>
            )}
            <p className="person_desc">
              {renderWithHighlights(selectedPerson.desc, highlightNames, 'person_desc_name')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RelationshipPage;
