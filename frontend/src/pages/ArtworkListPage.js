import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ArtworkListPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const LIST_STATE_STORAGE_KEY = 'artworkListState';

function ArtworkListPage() {
  const location = useLocation();
  const getInitialListState = () => {
    if (location.state?.fromHome) {
      const shuffleSeed = Math.floor(Date.now() + Math.random() * 1000000);
      return {
        pageNo: 1,
        category: '',
        stylePeriod: '',
        sortOrder: 'default',
        shuffleSeed,
      };
    }

    try {
      const raw = localStorage.getItem(LIST_STATE_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);

      const pageNo = Number.isFinite(Number(parsed?.pageNo)) ? Math.max(1, Number(parsed.pageNo)) : 1;
      const category = typeof parsed?.category === 'string' ? parsed.category : '';
      const stylePeriod = typeof parsed?.stylePeriod === 'string' ? parsed.stylePeriod : '';
      const sortOrder =
        parsed?.sortOrder === 'default' || parsed?.sortOrder === 'year_asc' || parsed?.sortOrder === 'year_desc'
          ? parsed.sortOrder
          : 'default';
      const shuffleSeed = Number.isFinite(Number(parsed?.shuffleSeed)) ? Number(parsed.shuffleSeed) : undefined;

      return { pageNo, category, stylePeriod, sortOrder, shuffleSeed };
    } catch {
      return null;
    }
  };

  const initialListState = getInitialListState();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [pageNo, setPageNo] = useState(() => {
    return initialListState?.pageNo ?? 1;
  });
  const [pageN, setPageN] = useState(1);
  const [category, setCategory] = useState(() => initialListState?.category ?? ''); // '' means all, '画作' for Paintings, '书法' for Calligraphy
  const [stylePeriod, setStylePeriod] = useState(() => initialListState?.stylePeriod ?? ''); // '' means all, '早期' | '中期' | '晚期'
  const [sortOrder, setSortOrder] = useState(() => initialListState?.sortOrder ?? 'default'); // default | year_desc | year_asc
  const [shuffleSeed, setShuffleSeed] = useState(() => initialListState?.shuffleSeed ?? Math.floor(Date.now()));
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
        if (stylePeriod) {
          formData.append('stylePeriod', stylePeriod);
        }
        if (sortOrder && sortOrder !== 'default') {
          formData.append('sort', sortOrder);
        } else {
          formData.append('shuffleSeed', String(shuffleSeed));
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
  }, [pageNo, category, stylePeriod, sortOrder]);

  useEffect(() => {
    localStorage.setItem(
      LIST_STATE_STORAGE_KEY,
      JSON.stringify({
        pageNo,
        category,
        stylePeriod,
        sortOrder,
        shuffleSeed,
      })
    );
  }, [pageNo, category, stylePeriod, sortOrder, shuffleSeed]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPageNo(1); // Reset to first page when filtering
  };

  const handleStylePeriodChange = (newStylePeriod) => {
    setStylePeriod(newStylePeriod);
    setPageNo(1);
  };

  const handleSortOrderChange = (newSortOrder) => {
    if (newSortOrder === 'default' && sortOrder !== 'default') {
      setShuffleSeed(Math.floor(Date.now() + Math.random() * 1000000));
    }
    setSortOrder(newSortOrder);
    setPageNo(1);
  };

  const handleResetFilters = () => {
    setCategory('');
    setStylePeriod('');
    setSortOrder('default');
    setShuffleSeed(Math.floor(Date.now() + Math.random() * 1000000));
    setPageNo(1);
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
            <div className="filter-left">
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

            <div className="filter-combos">
              <div className="filter-combo">
                <label className="filter-combo-label" htmlFor="sortOrder">排序</label>
                <select
                  id="sortOrder"
                  className="filter-combo-select"
                  value={sortOrder}
                  onChange={(e) => handleSortOrderChange(e.target.value)}
                >
                  <option value="default">默认（乱序）</option>
                  <option value="year_desc">按年份：降序</option>
                  <option value="year_asc">按年份：升序</option>
                </select>
              </div>

              <div className="filter-combo">
                <label className="filter-combo-label" htmlFor="stylePeriod">时期</label>
                <select
                  id="stylePeriod"
                  className="filter-combo-select"
                  value={stylePeriod}
                  onChange={(e) => handleStylePeriodChange(e.target.value)}
                >
                  <option value="">全部</option>
                  <option value="早期">早期</option>
                  <option value="中期">中期</option>
                  <option value="晚期">晚期</option>
                </select>
              </div>

              <button
                type="button"
                className="filter-reset-btn"
                onClick={handleResetFilters}
                disabled={category === '' && stylePeriod === '' && sortOrder === 'default'}
                title="重置筛选与排序"
              >
                重置
              </button>
            </div>
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
