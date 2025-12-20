import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArtworkListPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function ArtworkListPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageN, setPageN] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    // 背景轮播
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 从后端获取数据
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('pageNo', pageNo);
        formData.append('pageSize', pageSize);

        const response = await fetch(`${API_BASE}/frontend/pg/huang/huang-collection`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setArtworks(data.infomationList || []);
        setPageN(data.pageN || 1);
      } catch (error) {
        console.error('获取作品列表失败:', error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [pageNo]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div
      className="artwork-list-page"
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

      <Link to="/" className="a_home">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      <div className="list_main">
        <div className="padding_50">
          <div className="lujin">首页 / 观看 / 作品全览</div>

          <div className="artwork-grid">
            {artworks.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.id}`}
                className="artwork-card"
              >
                <div className="artwork-image">
                  <img
                    src={`${API_BASE}/static/${artwork.smallPic.directoryName}/${artwork.smallPic.resourceName}`}
                    alt={artwork.collectionName}
                    onError={(e) => {
                      e.target.src = '/images/bg1.jpg';
                    }}
                  />
                </div>
                <div className="artwork-info">
                  <h3>{artwork.collectionName}</h3>
                  <p className="author">{artwork.author}</p>
                  <p className="size">{artwork.collectionSize || artwork.collectionTime}</p>
                  <p className="intro">{artwork.intro || '黄宾虹作品'}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* 分页控件 */}
          <div className="pagination">
            <button
              onClick={() => setPageNo(p => Math.max(1, p - 1))}
              disabled={pageNo <= 1}
            >
              上一页
            </button>
            <span>{pageNo} / {pageN}</span>
            <button
              onClick={() => setPageNo(p => Math.min(pageN, p + 1))}
              disabled={pageNo >= pageN}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkListPage;
