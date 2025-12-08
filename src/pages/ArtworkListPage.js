import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArtworkListPage.css';

function ArtworkListPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    // 模拟数据加载
    const mockData = [
      {
        id: "HBH-0001",
        collectionName: "山水甲",
        author: "黄宾虹",
        age: "近现代",
        category: "010101",
        texture: "纸本",
        collectionSize: "27 厘米 × 18 厘米",
        collectionTime: "20世纪",
        collectionUnit: "浙江省博物馆",
        intro: "早期山水，格调清雅",
        smallPic: { directoryName: "images", resourceName: "bg1.jpg" },
      },
      {
        id: "HBH-0002",
        collectionName: "山水乙",
        author: "黄宾虹",
        age: "近现代",
        category: "010201",
        texture: "纸本",
        collectionSize: "30 厘米 × 20 厘米",
        collectionTime: "20世纪",
        collectionUnit: "浙江省博物馆",
        intro: "层层积墨，雪景意境",
        smallPic: { directoryName: "images", resourceName: "bg2.jpg" },
      },
      {
        id: "HBH-0003",
        collectionName: "石壁层叠",
        author: "黄宾虹",
        age: "近现代",
        category: "020101",
        texture: "纸本",
        collectionSize: "52.8 厘米 × 26.4 厘米",
        collectionTime: "20世纪",
        collectionUnit: "浙江省博物馆",
        intro: "秋山叠嶂，重墨浑厚",
        smallPic: { directoryName: "images", resourceName: "黄宾虹 《石壁层叠》.jpg" },
      },
      {
        id: "HBH-0004",
        collectionName: "拟倪瓒山水",
        author: "黄宾虹",
        age: "近现代",
        category: "020203",
        texture: "纸本",
        collectionSize: "30 厘米 × 20 厘米",
        collectionTime: "20世纪",
        collectionUnit: "浙江省博物馆",
        intro: "师法倪瓒，线条生动",
        smallPic: { directoryName: "images", resourceName: "黄宾虹 《拟倪瓒山水》.jpg" },
      },
    ];

    setTimeout(() => {
      setArtworks(mockData);
      setLoading(false);
    }, 500);
  }, [category]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="artwork-list-page">
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
                    src={`/${artwork.smallPic.directoryName}/${artwork.smallPic.resourceName}`}
                    alt={artwork.collectionName}
                    onError={(e) => {
                      e.target.src = '/images/bg1.jpg';
                    }}
                  />
                </div>
                <div className="artwork-info">
                  <h3>{artwork.collectionName}</h3>
                  <p className="author">{artwork.author}</p>
                  <p className="size">{artwork.collectionSize}</p>
                  <p className="intro">{artwork.intro}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkListPage;
