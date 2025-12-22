import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [showNav1, setShowNav1] = useState(false);
  const [showNav2, setShowNav2] = useState(false);
  const [showNav3, setShowNav3] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    // 禁用右键菜单
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // 背景图片切换
    const bgImages = ['/images/bg1.jpg', '/images/bg2.jpg'];
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="home-page-original">
      {/* 背景切换 */}
      <div
        className="bg-body"
        style={{
          backgroundImage: `url(${currentBg === 0 ? '/images/bg1.jpg' : '/images/bg2.jpg'})`,
          transition: 'background-image 1s ease-in-out'
        }}
      />

      <div className="header">
        <div className="in_main">
          <div className="right_bg" data-scroll-reveal="enter right after 0s">
            <img src="/images/right_bg.png" alt="" />
          </div>
          <div className="logo" data-scroll-reveal="enter right after 0.5s">
            <img src="/images/logo.png" alt="黄宾虹书画艺术专题" />
          </div>
          <div className="logo2" data-scroll-reveal="enter left after 0.5s">
            <img src="/images/logo_2.png" alt="" />
          </div>
          <div className="logo3" data-scroll-reveal="enter left after 1s">
            <img src="/images/logo3.png" alt="" />
          </div>

          {/* 观看 */}
          <div
            className="l_gk"
            data-scroll-reveal="enter bottom after 1s"
            onMouseEnter={() => setShowNav1(true)}
            onMouseLeave={() => setShowNav1(false)}
          >
            <span>
              <img src="/images/l_gk.png" alt="观看" />
            </span>
            <div
              id="nav_1"
              className="l_list"
              style={{ display: showNav1 ? 'block' : 'none' }}
            >
              <Link
                to="/artworks"
                state={{ fromHome: true }}
                className="a_guangkan_zpql"
                title="观看·作品全览"
                style={{
                  backgroundImage: 'url(/images/a_guangkan.png)',
                  backgroundPosition: '0px 0px'
                }}
              />
            </div>
          </div>

          {/* 探索 */}
          <div
            className="l_ts"
            data-scroll-reveal="enter bottom after 1.5s"
            onMouseEnter={() => setShowNav2(true)}
            onMouseLeave={() => setShowNav2(false)}
          >
            <span>
              <img src="/images/l_ts.png" alt="探索" />
            </span>
            <div
              id="nav_2"
              className="l_list"
              style={{ display: showNav2 ? 'block' : 'none' }}
            >
              <Link
                to="/timeline"
                className="a_tangsuo_rs"
                title="探索·生平"
                style={{
                  backgroundImage: 'url(/images/a_tangsuo.png)',
                  backgroundPosition: '0px 0px'
                }}
              />
              <Link
                to="/journey-map"
                className="a_tangsuo_rs"
                title="探索·交游"
                style={{
                  backgroundImage: 'url(/images/a_tangsuo.png)',
                  backgroundPosition: '0px -30px'
                }}
              />
              <Link
                to="/relationships"
                className="a_tangsuo_rs"
                title="探索·行迹"
                style={{
                  backgroundImage: 'url(/images/a_tangsuo.png)',
                  backgroundPosition: '0px -60px'
                }}
              />
            </div>
          </div>

          {/* 创作 */}
          <div
            className="l_cz"
            data-scroll-reveal="enter bottom after 2s"
            onMouseEnter={() => setShowNav3(true)}
            onMouseLeave={() => setShowNav3(false)}
          >
            <span>
              <img src="/images/l_cz.png" alt="创作" />
            </span>
            <div
              id="nav_3"
              className="l_list"
              style={{ display: showNav3 ? 'block' : 'none' }}
            >
              <Link
                to="/style-transfer"
                className="a_st"
                title="创作·风格迁移"
                style={{
                  backgroundImage: 'url(/images/st.png)',
                  backgroundPosition: '0px 0px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
