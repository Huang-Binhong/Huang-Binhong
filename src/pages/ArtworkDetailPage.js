import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArtworkDetailPage.css';

function ArtworkDetailPage() {
  const { id } = useParams();

  // 模拟数据
  const artworkData = {
    "HBH-0001": {
      collectionName: "山水甲",
      author: "黄宾虹",
      age: "近现代",
      texture: "纸本",
      collectionSize: "27 厘米 × 18 厘米",
      collectionTime: "20世纪",
      collectionUnit: "浙江省博物馆",
      intro: "这幅作品是黄宾虹早期山水画代表作之一，展现了其格调清雅的艺术风格。画面构图疏朗有致，笔墨淡雅清逸，体现了黄宾虹对传统山水画法的深刻理解和独特诠释。",
      image: "/images/bg1.jpg",
    },
    "HBH-0003": {
      collectionName: "石壁层叠",
      author: "黄宾虹",
      age: "近现代",
      texture: "纸本",
      collectionSize: "52.8 厘米 × 26.4 厘米",
      collectionTime: "20世纪",
      collectionUnit: "浙江省博物馆",
      intro: "此作品展现黄宾虹成熟期的绘画风格，秋山叠嶂，重墨浑厚。运用层层积墨的技法，使得画面具有强烈的立体感和厚重感，是其'黑密厚重、黑里透亮'画风的典型代表。",
      image: "/images/黄宾虹 《石壁层叠》.jpg",
    },
  };

  const artwork = artworkData[id] || artworkData["HBH-0001"];

  return (
    <div className="artwork-detail-page">
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
              <img src={artwork.image} alt={artwork.collectionName} />
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
                <span className="info_label">年代：</span>
                <span className="info_value">{artwork.age}</span>
              </div>
              <div className="info_item">
                <span className="info_label">质地：</span>
                <span className="info_value">{artwork.texture}</span>
              </div>
              <div className="info_item">
                <span className="info_label">尺寸：</span>
                <span className="info_value">{artwork.collectionSize}</span>
              </div>
              <div className="info_item">
                <span className="info_label">创作时间：</span>
                <span className="info_value">{artwork.collectionTime}</span>
              </div>
              <div className="info_item">
                <span className="info_label">收藏单位：</span>
                <span className="info_value">{artwork.collectionUnit}</span>
              </div>
            </div>

            <div className="artwork_description">
              <h3>作品简介</h3>
              <p>{artwork.intro}</p>
            </div>

            <div className="action_buttons">
              <Link to="/ai-explanation" className="btn_ai">
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
