import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArtworkDetailPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function ArtworkDetailPage() {
  const { id } = useParams();
  const [currentBg, setCurrentBg] = useState(0);
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const magnifierSize = 150;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const formatYear = (value) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    const match = text.match(/\d{4}/);
    return match ? match[0] : text;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 从后端获取作品详情
    const fetchArtwork = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('infomationId', id);

        const response = await fetch(`${API_BASE}/frontend/pg/huang/get-dong-by-id`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.infomation && data.infomation.id) {
          setArtwork({
            id: data.infomation.id,
            collectionName: data.infomation.collectionName,
            author: data.infomation.author || '黄宾虹',
            age: data.infomation.age || '近现代',
            category: data.infomation.category || '画作',
            stylePeriod: data.infomation.stylePeriod || '',
            texture: data.infomation.texture || '纸本',
            collectionSize: data.infomation.collectionSize || '',
            collectionTime: data.infomation.collectionTime || '',
            collectionUnit: data.infomation.collectionUnit || '',
            intro: data.infomation.intro || '黄宾虹经典作品',
            description: data.infomation.description || data.infomation.intro || '黄宾虹经典作品',
            image: `${API_BASE}/static/${data.smallPicSrc}`,
          });
        } else {
          // 没找到数据时使用默认值
          setArtwork({
            collectionName: '作品',
            author: '黄宾虹',
            age: '近现代',
            category: '画作',
            stylePeriod: '',
            texture: '纸本',
            collectionSize: '',
            collectionTime: '',
            collectionUnit: '',
            intro: '黄宾虹作品',
            description: '黄宾虹作品',
            image: '/images/bg1.jpg',
          });
        }
      } catch (error) {
        console.error('获取作品详情失败:', error);
        setArtwork({
          collectionName: '作品',
          author: '黄宾虹',
          age: '近现代',
          category: '画作',
          stylePeriod: '',
          texture: '纸本',
          collectionSize: '',
          collectionTime: '',
          collectionUnit: '',
          intro: '黄宾虹作品',
          description: '黄宾虹作品',
          image: '/images/bg1.jpg',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  // 处理滚轮事件（使用原生事件监听器以支持 preventDefault）
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (!magnifierActive) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const delta = e.deltaY < 0 ? 0.3 : -0.3;
      setZoomLevel((prev) => clamp(prev + delta, 1.5, 5));
    };

    // 添加非 passive 的滚轮事件监听器
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [magnifierActive]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current || !imageRef.current || !imageLoaded) {
      return;
    }
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const naturalWidth = imageRef.current.naturalWidth || 0;
    const naturalHeight = imageRef.current.naturalHeight || 0;

    if (!naturalWidth || !naturalHeight) {
      setMagnifierActive(false);
      return;
    }

    // 计算图片实际显示尺寸（contain模式，留出边距）
    const imagePadding = 0.95; // 缩放到95%，留出5%的边距
    const containerRatio = containerWidth / containerHeight;
    const imageRatio = naturalWidth / naturalHeight;

    let displayWidth = containerWidth;
    let displayHeight = containerHeight;

    if (imageRatio > containerRatio) {
      displayWidth = containerWidth * imagePadding;
      displayHeight = displayWidth / imageRatio;
    } else {
      displayHeight = containerHeight * imagePadding;
      displayWidth = displayHeight * imageRatio;
    }

    const offsetX = (containerWidth - displayWidth) / 2;
    const offsetY = (containerHeight - displayHeight) / 2;

    // 检查鼠标是否在图片区域内
    const inImage =
      mouseX >= offsetX &&
      mouseX <= offsetX + displayWidth &&
      mouseY >= offsetY &&
      mouseY <= offsetY + displayHeight;

    if (!inImage) {
      setMagnifierActive(false);
      return;
    }

    // 计算鼠标在图片内的相对位置（0-1）
    const relativeX = (mouseX - offsetX) / displayWidth;
    const relativeY = (mouseY - offsetY) / displayHeight;

    setImageOffset({ x: offsetX, y: offsetY });
    setImageSize({ width: displayWidth, height: displayHeight });
    setMagnifierPos({ x: relativeX, y: relativeY });
    setMagnifierActive(true);
  };

  const handleMouseLeave = () => {
    setMagnifierActive(false);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  // 计算放大镜指示框的位置和大小（根据缩放倍数调整框的大小）
  const previewSize = 300; // 预览窗口大小
  const lensWidth = previewSize / zoomLevel; // 框的大小随缩放倍数反向变化
  const lensHeight = previewSize / zoomLevel;
  
  // 计算指示框中心位置
  const lensCenterX = imageOffset.x + magnifierPos.x * imageSize.width;
  const lensCenterY = imageOffset.y + magnifierPos.y * imageSize.height;
  
  // 计算指示框左上角位置
  let lensX = lensCenterX - lensWidth / 2;
  let lensY = lensCenterY - lensHeight / 2;

  // 允许指示框超出图片边界一小圈（30px）
  const lensOverflow = 30;
  const clampedLensX = clamp(
    lensX, 
    imageOffset.x - lensOverflow, 
    imageOffset.x + Math.max(0, imageSize.width - lensWidth) + lensOverflow
  );
  const clampedLensY = clamp(
    lensY, 
    imageOffset.y - lensOverflow, 
    imageOffset.y + Math.max(0, imageSize.height - lensHeight) + lensOverflow
  );

  // 计算预览窗口背景图片的位置和大小
  const bgWidth = imageSize.width * zoomLevel;
  const bgHeight = imageSize.height * zoomLevel;
  
  // 计算背景偏移：需要将鼠标位置对应的图片区域居中显示在预览窗口中
  // 背景图片的偏移 = -(鼠标相对位置 * 放大后的图片尺寸) + (预览窗口尺寸 / 2)
  const bgPosX = -(magnifierPos.x * bgWidth) + (previewSize / 2);
  const bgPosY = -(magnifierPos.y * bgHeight) + (previewSize / 2);

  return (
    <div
      className="artwork-detail-page"
      style={{
        backgroundImage: `url(${BG_IMAGES[currentBg]})`
      }}
    >
      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>
      <div className="nav_logo3">
        <img src="/images/list_logo3.png" alt="" />
      </div>

      <Link to="/artworks" className="a_back">
        <img src="/images/a_home.png" alt="返回列表" />
      </Link>

      <div className="detail_main">
        <div className="breadcrumb">首页 / 观看 / 作品全览 / {artwork.collectionName}</div>

        <div className="detail_content">
          <div className="artwork_image_section">
            <div className="main_image">
              <div
                className="main_image_viewport"
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imageRef}
                  src={artwork.image}
                  alt={artwork.collectionName}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = '/images/bg1.jpg';
                    setImageLoaded(true);
                  }}
                />
                
                {/* 放大镜指示框 */}
                {magnifierActive && imageLoaded && imageSize.width > 0 && imageSize.height > 0 && (
                  <div
                    className="magnifier_lens"
                    style={{
                      width: `${lensWidth}px`,
                      height: `${lensHeight}px`,
                      left: `${clampedLensX}px`,
                      top: `${clampedLensY}px`
                    }}
                  />
                )}
              </div>

              {/* 放大预览窗口 */}
              {magnifierActive && imageLoaded && imageSize.width > 0 && imageSize.height > 0 && artwork && artwork.image && (
                <div className="magnifier_preview">
                  <div
                    className="magnifier_preview_inner"
                    style={{
                      backgroundImage: `url("${artwork.image}")`,
                      backgroundSize: `${bgWidth}px ${bgHeight}px`,
                      backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  <div className="magnifier_zoom_info">
                    {zoomLevel.toFixed(1)}x
                  </div>
                </div>
              )}

              {/* 功能按钮 */}
              <div className="image_controls">
                <button 
                  className="control_btn fullscreen_btn" 
                  onClick={() => setFullscreenOpen(true)}
                  title="全屏查看"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                </button>
              </div>

              {/* 提示信息 */}
              {imageLoaded && !magnifierActive && (
                <div className="magnifier_hint">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span>移动鼠标放大查看 · 滚轮调节倍率</span>
                </div>
              )}
            </div>

            {/* 全屏查看模态框 */}
            {fullscreenOpen && (
              <div className="fullscreen_overlay" onClick={() => setFullscreenOpen(false)}>
                <div className="fullscreen_content" onClick={(e) => e.stopPropagation()}>
                  <button className="fullscreen_close" onClick={() => setFullscreenOpen(false)}>
                    ×
                  </button>
                  <img src={artwork.image} alt={artwork.collectionName} />
                </div>
              </div>
            )}
          </div>

          <div className="artwork_info_section">
            <h1 className="artwork_title">{artwork.collectionName}</h1>

            <div className="info_grid">
              <div className="info_item">
                <span className="info_label">作者：</span>
                <span className="info_value">{artwork.author}</span>
              </div>
              <div className="info_item">
                <span className="info_label">时期：</span>
                <span className="info_value">{artwork.stylePeriod}</span>
              </div>
              <div className="info_item">
                <span className="info_label">质地：</span>
                <span className="info_value">{artwork.texture}</span>
              </div>
              {artwork.collectionSize && (
                <div className="info_item">
                  <span className="info_label">尺寸：</span>
                  <span className="info_value">{artwork.collectionSize}</span>
                </div>
              )}
              {artwork.collectionTime && (
                <div className="info_item">
                  <span className="info_label">年份：</span>
                  <span className="info_value">{formatYear(artwork.collectionTime)}</span>
                </div>
              )}
            </div>

            <div className="artwork_description">
              <h3>作品介绍</h3>
              <p>{artwork.description}</p>
            </div>

            <div className="action_buttons">
              <Link
                to={`/ai-explanation?artworkId=${id}`}
                state={{ artwork: artwork, fromPath: `/artwork/${id}` }}
                className="btn_ai"
              >
                AI艺术讲解
              </Link>
              <Link to="/style-transfer" className="btn_style">
                风格迁移
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkDetailPage;
