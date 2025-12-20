import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeArtwork } from '../utils/aiService';
import '../styles/AIExplanationPage.css';

function AIExplanationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // 从location.state获取传递的作品信息
  const artwork = location.state?.artwork;
  const fromPath = location.state?.fromPath || '/artworks';

  // 检查是否从作品详情页进入
  useEffect(() => {
    if (!artwork) {
      // 如果没有作品信息，重定向到作品列表页
      alert('请从作品详情页进入AI讲解功能');
      navigate('/artworks');
      return;
    }

    // 自动加载作品图片
    if (artwork.image) {
      setUploadedImage(artwork.image);
      
      // 将图片URL转换为File对象
      fetch(artwork.image)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `${artwork.collectionName}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
        })
        .catch(err => {
          console.error('加载作品图片失败:', err);
        });
    }
  }, [artwork, navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // 清除之前的分析结果
      setAnalysisResult(null);
    }
  };

  const handleAIAnalysis = async () => {
    if (!imageFile) {
      alert('请先上传图片');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeArtwork(imageFile);
      setAnalysisResult(result);
      
      // 在控制台输出原始响应，方便调试
      if (result.success && result.data) {
        console.log('AI分析原始响应:', result.data);
      }
    } catch (error) {
      console.error('AI分析出错:', error);
      alert('AI分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="ai-page">
      <header className="ai-page-header">
        <Link to={fromPath} className="back-button">
          ← 返回作品详情
        </Link>
        <h1>AI艺术讲解系统</h1>
        {artwork && (
          <div className="artwork-title-header">
            《{artwork.collectionName}》
          </div>
        )}
      </header>
      <main className="ai-page-content">
        <div className="artwork-display">
          <div className="artwork-placeholder">
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Uploaded artwork" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <>
                <p>艺术作品展示区域</p>
                <p>（此处应显示选中的艺术作品）</p>
              </>
            )}
          </div>
          <div className="upload-section">
            {uploadedImage && (
              <button 
                className="analyze-button"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'AI分析中...' : 'AI智能分析'}
              </button>
            )}
          </div>
          <div className="instructions">
            <h3>作品信息</h3>
            {artwork && (
              <>
                <p><strong>作品名称：</strong>{artwork.collectionName}</p>
                <p><strong>作者：</strong>{artwork.author}</p>
                <p><strong>年代：</strong>{artwork.age}</p>
                <p><strong>收藏：</strong>{artwork.collectionUnit}</p>
              </>
            )}
            <h3>使用说明</h3>
            <p>点击"AI智能分析"按钮，系统将对当前作品进行智能分析，包括笔法、墨色、构图等艺术特征。</p>
          </div>
        </div>
        <div className="artwork-info">
          {isAnalyzing ? (
            <div className="ai-analyzing">
              <h3>正在分析中...</h3>
              <div className="loading-spinner"></div>
              <p>AI正在深入解读这幅作品，请稍候...</p>
            </div>
          ) : (
            <>
              {analysisResult && analysisResult.success && (
                <div className="ai-analysis-result">
                  <h3>AI分析结果</h3>
                  <div className="ai-response-content">
                    {analysisResult.data.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {analysisResult.data.content}
                      </ReactMarkdown>
                    ) : analysisResult.data.choices && analysisResult.data.choices[0]?.message?.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {analysisResult.data.choices[0].message.content}
                      </ReactMarkdown>
                    ) : (
                      <p>收到分析结果，但格式未知。原始响应数据已记录到控制台。</p>
                    )}
                  </div>
                </div>
              )}
              {!analysisResult && !uploadedImage && (
                <div className="ai-prompt">
                  <h3>欢迎使用AI艺术讲解系统</h3>
                  <p>请先上传一幅艺术作品图片，然后点击"AI智能分析"按钮开始分析。</p>
                </div>
              )}
              {!analysisResult && uploadedImage && (
                <div className="ai-analysis-section">
                  <h3>准备分析</h3>
                  <p>图片已上传，请点击"AI智能分析"按钮开始分析。</p>
                </div>
              )}
              {analysisResult && !analysisResult.success && (
                <div className="ai-analysis-error">
                  <h3>AI分析失败</h3>
                  <p>{analysisResult.error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AIExplanationPage;