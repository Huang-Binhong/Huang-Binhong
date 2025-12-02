import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AIExplanation.css';

const AIExplanation = ({ analysisData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // 检查是否有真实的AI分析数据
  const hasRealData = analysisData && analysisData.success && analysisData.data;

  return (
    <div className="ai-explanation-container">
      {/* AI讲解按钮 */}
      <button className="ai-explanation-button" onClick={togglePanel}>
        AI 讲解
      </button>

      {/* AI讲解面板 */}
      {isOpen && (
        <div className="ai-explanation-panel">
          <div className="ai-explanation-header">
            <h2>AI 艺术讲解</h2>
            <button className="close-button" onClick={togglePanel}>×</button>
          </div>
          
          {/* 讲解内容 */}
          <div className="ai-explanation-content">
            {hasRealData ? (
              <>
                <h3>AI 分析结果</h3>
                <div className="ai-response-content">
                  {analysisData.data.choices && analysisData.data.choices[0] && analysisData.data.choices[0].message ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysisData.data.choices[0].message.content}
                    </ReactMarkdown>
                  ) : (
                    <p>收到分析结果，但格式未知。原始响应数据已记录到控制台。</p>
                  )}
                </div>
                <div className="raw-data-section">
                  <h4>原始响应数据:</h4>
                  <pre>{JSON.stringify(analysisData.data, null, 2)}</pre>
                </div>
              </>
            ) : (
              <>
                <h3>AI 艺术讲解</h3>
                <p>AI系统将对您上传的艺术作品进行智能分析，包括：</p>
                <ul>
                  <li>笔法特点分析（如披麻皴、斧劈皴等）</li>
                  <li>墨色层次解析</li>
                  <li>构图和布局特点</li>
                  <li>题款和印章识别</li>
                  <li>作品背景故事</li>
                </ul>
                <p>请先在作品详情页上传图片并进行AI分析。</p>
                
                {analysisData && !analysisData.success && (
                  <div className="error-message">
                    <h4>分析出错</h4>
                    <p>{analysisData.error}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanation;