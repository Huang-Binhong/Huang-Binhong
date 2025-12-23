import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ArtworkListPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function ArtworkListPage() {
  const location = useLocation();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [pageNo, setPageNo] = useState(() => {
    // 如果是从主页进入（state 中有 fromHome 标记），从第一页开始
    // 否则从 localStorage 恢复页码（刷新或从详情页返回）
    if (location.state?.fromHome) {
      return 1;
    }
    const savedPage = localStorage.getItem('artworkListPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [pageN, setPageN] = useState(1);
  const [category, setCategory] = useState(''); // '' means all, '画作' for Paintings, '书法' for Calligraphy
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 12;

  const formatYear = (value) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    const match = text.match(/\d{4}/);
    return match ? match[0] : text;
  };

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
        if (category) {
          formData.append('category', category);
        }

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
    // 保存当前页码到 localStorage
    localStorage.setItem('artworkListPage', pageNo);
  }, [pageNo, category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPageNo(1); // Reset to first page when filtering
  };

  const handleJump = () => {
    const page = parseInt(jumpPage, 10);
    if (!isNaN(page) && page >= 1 && page <= pageN) {
      setPageNo(page);
      setJumpPage('');
    } else {
      // Optional: Show error or visual feedback
    }
  };

  const handleJumpKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  // 生成页码数组（智能显示）
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // 最多显示7个页码

    if (pageN <= maxVisible) {
      // 总页数少于等于最大显示数，显示所有页码
      for (let i = 1; i <= pageN; i++) {
        pages.push(i);
      }
    } else {
      // 总页数多于最大显示数，智能显示
      if (pageNo <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(pageN);
      } else if (pageNo >= pageN - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push('...');
        for (let i = pageN - 4; i <= pageN; i++) pages.push(i);
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = pageNo - 1; i <= pageNo + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(pageN);
      }
    }
    return pages;
  };

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

          <div className="filter-container">
            <button 
              className={`filter-btn ${category === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              全部
            </button>
            <button 
              className={`filter-btn ${category === '画作' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('画作')}
            >
              画作
            </button>
            <button 
              className={`filter-btn ${category === '书法' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('书法')}
            >
              书法
            </button>
          </div>

          <div className="artwork-list-waterfall">
            {artworks.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.id}`}
                className="artwork-list-card"
              >
                <div className="artwork-list-image">
                  <img
                    src={`${API_BASE}/static/${artwork.smallPic.directoryName}/${artwork.smallPic.resourceName}`}
                    alt={artwork.collectionName}
                    onError={(e) => {
                      e.target.src = '/images/bg1.jpg';
                    }}
                  />
                </div>
                <div className="artwork-list-info">
                  <h3>{artwork.collectionName}</h3>
                  {artwork.author && (
                    <p className="artwork-list-author">作者：{artwork.author}</p>
                  )}
                  {artwork.collectionSize && (
                    <p className="artwork-list-size">尺寸：{artwork.collectionSize}</p>
                  )}
                  {artwork.collectionTime && (
                    <p className="artwork-list-year">年份：{formatYear(artwork.collectionTime)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* 分页控件 */}
          <div className="pagination">
            <button
              className="pagination-btn prev-btn"
              onClick={() => setPageNo(p => Math.max(1, p - 1))}
              disabled={pageNo <= 1}
            >
              <span className="btn-text">上一页</span>
            </button>

            <div className="page-numbers">
              {getPageNumbers().map((num, index) => (
                num === '...' ? (
                  <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                ) : (
                  <button
                    key={num}
                    className={`page-number ${num === pageNo ? 'active' : ''}`}
                    onClick={() => setPageNo(num)}
                  >
                    {num}
                  </button>
                )
              ))}
            </div>

            <button
              className="pagination-btn next-btn"
              onClick={() => setPageNo(p => Math.min(pageN, p + 1))}
              disabled={pageNo >= pageN}
            >
              <span className="btn-text">下一页</span>
            </button>

            <div className="jump-container">
              <span className="jump-text">跳转至</span>
              <input
                type="number"
                min="1"
                max={pageN}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={handleJumpKeyDown}
                className="jump-input"
              />
              <span className="jump-text">页</span>
              <button className="jump-btn" onClick={handleJump}>GO</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkListPage;
