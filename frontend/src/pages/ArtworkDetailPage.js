import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArtworkDetailPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function ArtworkDetailPage() {
  const { id } = useParams();
  const [currentBg, setCurrentBg] = useState(0);
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const lensSize = 180;

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

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const naturalWidth = imageRef.current?.naturalWidth || 0;
    const naturalHeight = imageRef.current?.naturalHeight || 0;

    if (!naturalWidth || !naturalHeight || !containerWidth || !containerHeight) {
      const x = clamp(rawX, 0, containerWidth);
      const y = clamp(rawY, 0, containerHeight);
      setImageOffset({ x: 0, y: 0 });
      setImageSize({ width: containerWidth, height: containerHeight });
      setLensPos({ x, y });
      setLensVisible(true);
      return;
    }

    const containerRatio = containerWidth / containerHeight;
    const imageRatio = naturalWidth / naturalHeight;

    let displayWidth = containerWidth;
    let displayHeight = containerHeight;

    if (imageRatio > containerRatio) {
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageRatio;
    } else {
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageRatio;
    }

    const offsetX = (containerWidth - displayWidth) / 2;
    const offsetY = (containerHeight - displayHeight) / 2;

    const inImage =
      rawX >= offsetX &&
      rawX <= offsetX + displayWidth &&
      rawY >= offsetY &&
      rawY <= offsetY + displayHeight;

    if (!inImage) {
      setLensVisible(false);
      return;
    }

    const x = clamp(rawX - offsetX, 0, displayWidth);
    const y = clamp(rawY - offsetY, 0, displayHeight);

    setImageOffset({ x: offsetX, y: offsetY });
    setImageSize({ width: displayWidth, height: displayHeight });
    setLensPos({ x, y });
    setLensVisible(true);
  };

  const handleMouseLeave = () => {
    setLensVisible(false);
  };

  const handleWheel = (e) => {
    if (!imageContainerRef.current) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((prev) => clamp(prev + delta, 1.2, 4));
    setLensVisible(true);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const lensLeft = Math.max(
    imageOffset.x,
    Math.min(
      imageOffset.x + lensPos.x - lensSize / 2,
      imageOffset.x + Math.max(imageSize.width - lensSize, 0)
    )
  );
  const lensTop = Math.max(
    imageOffset.y,
    Math.min(
      imageOffset.y + lensPos.y - lensSize / 2,
      imageOffset.y + Math.max(imageSize.height - lensSize, 0)
    )
  );
  const bgPosX = imageSize.width ? (lensPos.x / imageSize.width) * 100 : 0;
  const bgPosY = imageSize.height ? (lensPos.y / imageSize.height) * 100 : 0;
  const bgWidth = imageSize.width * zoom;
  const bgHeight = imageSize.height * zoom;

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
            <div
              className="main_image"
            >
              <div
                className="main_image_viewport"
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
              >
                <img
                  ref={imageRef}
                  src={artwork.image}
                  alt={artwork.collectionName}
                  onError={(e) => {
                    e.target.src = '/images/bg1.jpg';
                  }}
                />
                {lensVisible && imageSize.width > 0 && imageSize.height > 0 && (
                  <div
                    className="zoom_lens"
                    style={{
                      width: lensSize,
                      height: lensSize,
                      left: lensLeft,
                      top: lensTop,
                      backgroundImage: `url(${artwork.image})`,
                      backgroundSize: `${bgWidth}px ${bgHeight}px`,
                      backgroundPosition: `${bgPosX}% ${bgPosY}%`
                    }}
                  />
                )}
              </div>
            </div>
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
