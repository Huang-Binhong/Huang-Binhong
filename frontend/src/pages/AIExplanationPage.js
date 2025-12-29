import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeArtwork, chatWithAI } from '../utils/aiService';
import '../styles/AIExplanationPage.css';

function AIExplanationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // 添加ref用于滚动到底部
  const chatMessagesEndRef = useRef(null);
  const chatMessagesContainerRef = useRef(null);

  // 从location.state获取传递的作品信息
  const artwork = location.state?.artwork;
  const fromPath = location.state?.fromPath || '/artworks';

  // 当聊天消息更新时，自动滚动到底部
  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      // 使用 scrollTo 实现平滑滚动
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isChatting]);

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

    // 自动检查并加载缓存的分析结果
    const loadCachedAnalysis = async () => {
      if (!artwork.id) return;
      
      try {
        // 调用API查询缓存（不上传文件）
        const result = await analyzeArtwork(null, '', artwork?.category, artwork?.id);
        
        if (result.success && result.cached && result.data) {
          // 如果有缓存，直接显示
          console.log('加载缓存的分析结果');
          setAnalysisResult(result);
          setChatMessages([{
            role: 'assistant',
            content: result.data.content
          }]);
        }
      } catch (error) {
        console.error('加载缓存失败:', error);
      }
    };

    loadCachedAnalysis();
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
      // 传递category和work_id到后端
      const result = await analyzeArtwork(imageFile, '', artwork?.category, artwork?.id);
      setAnalysisResult(result);

      // 如果分析成功，将结果添加到聊天记录
      if (result.success && result.data) {
        console.log('AI分析原始响应:', result.data);
        if (result.cached) {
          console.log('使用缓存的分析结果');
        }

        // 添加到聊天记录
        setChatMessages([{
          role: 'assistant',
          content: result.data.content
        }]);
      }
    } catch (error) {
      console.error('AI分析出错:', error);
      alert('AI分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 刷新聊天，清空对话记录但保留初始分析
  const handleRefreshChat = () => {
    // 只保留第一条消息（初始AI分析结果）
    if (chatMessages.length > 0 && chatMessages[0].role === 'assistant') {
      setChatMessages([chatMessages[0]]);
    } else {
      setChatMessages([]);
    }
    setUserQuestion('');
  };

  const handleSendQuestion = async () => {
    if (!userQuestion.trim()) {
      return;
    }

    if (!artwork?.id) {
      alert('缺少作品信息');
      return;
    }

    // 添加用户问题到聊天记录
    const newUserMessage = {
      role: 'user',
      content: userQuestion
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserQuestion('');
    setIsChatting(true);

    try {
      const result = await chatWithAI(artwork.id, userQuestion);

      if (result.success && result.data) {
        // 添加AI回复到聊天记录
        const newAssistantMessage = {
          role: 'assistant',
          content: result.data.content
        };
        setChatMessages(prev => [...prev, newAssistantMessage]);
      } else {
        alert('对话失败：' + (result.error || '未知错误'));
      }
    } catch (error) {
      console.error('AI对话出错:', error);
      alert('对话失败，请稍后重试');
    } finally {
      setIsChatting(false);
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
                onClick={chatMessages.length > 0 ? handleRefreshChat : handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'AI分析中...' : (chatMessages.length > 0 ? '刷新聊天' : 'AI智能分析')}
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
              {chatMessages.length > 0 ? (
                <div className="ai-chat-container">
                  <h3>AI讲解与对话</h3>
                  <div className="chat-messages" ref={chatMessagesContainerRef}>
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`chat-message ${msg.role}`}>
                        <div className="message-label">
                          {msg.role === 'user' ? '您' : 'AI助手'}
                        </div>
                        <div className="message-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="chat-message assistant">
                        <div className="message-label">AI助手</div>
                        <div className="message-content">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* 用于滚动到底部的锚点 */}
                    <div ref={chatMessagesEndRef} />
                  </div>
                  <div className="chat-input-area">
                    <input
                      type="text"
                      className="chat-input"
                      placeholder="继续提问关于这幅作品的问题..."
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isChatting) {
                          handleSendQuestion();
                        }
                      }}
                      disabled={isChatting}
                    />
                    <button
                      className="send-button"
                      onClick={handleSendQuestion}
                      disabled={isChatting || !userQuestion.trim()}
                    >
                      {isChatting ? '发送中...' : '发送'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {!uploadedImage && (
                    <div className="ai-prompt">
                      <h3>欢迎使用AI艺术讲解系统</h3>
                      <p>请先上传一幅艺术作品图片，然后点击"AI智能分析"按钮开始分析。</p>
                    </div>
                  )}
                  {uploadedImage && (
                    <div className="ai-analysis-section">
                      <h3>准备分析</h3>
                      <p>图片已上传，请点击"AI智能分析"按钮开始分析。</p>
                    </div>
                  )}
                </>
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