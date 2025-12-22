import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  useEffect(() => {
    // 禁用右键菜单
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="home-page">
      <div className="header">
        <div className="in_main">
          <div className="right_bg">
            <img src="/images/right_bg.png" alt="" />
          </div>
          <div className="logo">
            <img src="/images/logo.png" alt="黄宾虹书画艺术专题" />
          </div>
        </div>
      </div>

      <div className="main_content">
        <div className="navigation-grid">
          <Link to="/artworks" state={{ fromHome: true }} className="nav-card">
            <img src="/images/l_gk.png" alt="观看作品全览" />
            <h3>观看</h3>
            <p>作品全览</p>
          </Link>

          <div className="nav-card-group">
            <div className="nav-card-title">
              <img src="/images/l_ts.png" alt="探索" />
              <h3>探索</h3>
            </div>
            <div className="nav-sub-cards">
              <Link to="/journey-map" className="sub-card">
                <p>黄宾虹生平游历地图</p>
              </Link>
              <Link to="/relationships" className="sub-card">
                <p>黄宾虹人物关系图谱</p>
              </Link>
              <Link to="/ai-explanation" className="sub-card">
                <p>AI艺术讲解</p>
              </Link>
            </div>
          </div>

          <div className="nav-card-group">
            <div className="nav-card-title">
              <img src="/images/l_cz.png" alt="创作" />
              <h3>创作</h3>
            </div>
            <div className="nav-sub-cards">
              <Link to="/style-transfer" className="sub-card">
                <p>AI风格迁移</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>黄宾虹书画艺术数字化平台</p>
        <p>© 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default HomePage;
