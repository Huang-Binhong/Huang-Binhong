import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeArtwork } from './services/aiService';
import './AIExplanationPage.css';

function AIExplanationPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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
        <Link to="/home" className="back-button">
          ← 返回主页
        </Link>
        <h1>AI艺术讲解系统</h1>
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
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              id="image-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload" className="upload-button">
              选择图片
            </label>
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
            <h3>使用说明</h3>
            <p>请上传一幅艺术作品图片，点击"AI智能分析"按钮，系统将自动分析并展示结果。</p>
          </div>
        </div>
        <div className="artwork-info">
          {analysisResult && analysisResult.success && (
            <div className="ai-analysis-result">
              <h3>AI分析结果</h3>
              <div className="ai-response-content">
                {analysisResult.data.choices && analysisResult.data.choices[0] && analysisResult.data.choices[0].message ? (
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
        </div>
      </main>
    </div>
  );
}

export default AIExplanationPage;