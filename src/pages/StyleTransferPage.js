import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StyleTransferPage.css';

function StyleTransferPage() {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStyleImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleTransfer = async () => {
    if (!contentImage || !styleImage) {
      alert('请先上传内容图片和风格图片');
      return;
    }

    setLoading(true);
    
    // 模拟风格迁移过程
    setTimeout(() => {
      // 这里应该调用后端API进行风格迁移
      // 现在仅作演示，直接使用内容图片
      setResultImage(contentImage);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="style-transfer-page">
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

      <div className="style_main">
        <div className="breadcrumb">首页 / 创作 / AI风格迁移</div>

        <div className="style_content">
          <h1 className="page_title">AI风格迁移 - 黄宾虹画风生成</h1>
          <p className="page_desc">上传您的图片，让AI为您生成具有黄宾虹大师风格的艺术作品</p>

          <div className="transfer_workspace">
            <div className="upload_section">
              <div className="upload_card">
                <h3>内容图片</h3>
                <div className="upload_area">
                  {contentImage ? (
                    <img src={contentImage} alt="内容图片" />
                  ) : (
                    <div className="upload_placeholder">
                      <p>点击或拖拽上传图片</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleContentUpload}
                    className="file_input"
                  />
                </div>
              </div>

              <div className="upload_card">
                <h3>风格参考</h3>
                <div className="upload_area">
                  {styleImage ? (
                    <img src={styleImage} alt="风格图片" />
                  ) : (
                    <div className="upload_placeholder">
                      <p>选择黄宾虹作品</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleStyleUpload}
                    className="file_input"
                  />
                </div>
                <div className="style_presets">
                  <button onClick={() => setStyleImage('/images/bg1.jpg')}>
                    山水甲
                  </button>
                  <button onClick={() => setStyleImage('/images/bg2.jpg')}>
                    山水乙
                  </button>
                </div>
              </div>

              <div className="upload_card result_card">
                <h3>生成结果</h3>
                <div className="upload_area">
                  {loading ? (
                    <div className="loading_animation">
                      <div className="spinner"></div>
                      <p>AI正在生成中...</p>
                    </div>
                  ) : resultImage ? (
                    <img src={resultImage} alt="生成结果" />
                  ) : (
                    <div className="upload_placeholder">
                      <p>等待生成</p>
                    </div>
                  )}
                </div>
                {resultImage && !loading && (
                  <button className="download_btn">下载作品</button>
                )}
              </div>
            </div>

            <div className="action_section">
              <button 
                className="generate_btn"
                onClick={handleStyleTransfer}
                disabled={loading || !contentImage || !styleImage}
              >
                {loading ? '生成中...' : '开始生成'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleTransferPage;
