import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeArtwork, chatWithAI } from '../utils/aiService';
import './AIExplanationPage.css';

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
  const [uiMode, setUiMode] = useState('intro'); // 'intro' | 'intro-hiding' | 'chat'

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

  useEffect(() => {
    if (chatMessages.length === 0) return;

    setUiMode((prev) => {
      if (prev === 'chat') return prev;
      return 'intro-hiding';
    });

    const timer = setTimeout(() => {
      setUiMode('chat');
    }, 220);

    return () => clearTimeout(timer);
  }, [chatMessages.length]);

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
      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>
      <div className="nav_logo3">
        <img src="/images/list_logo3.png" alt="" />
      </div>

      <Link to={fromPath} className="a_home">
        <img src="/images/a_home.png" alt="返回作品详情" />
      </Link>

      <main className="ai_main">
        <section className="ai-page-content">
          <div className="ai-content-header">
            <div className="ai-content-title">
              <div className="ai-content-title-row">
                <h2 className="ai-artwork-title">{artwork?.collectionName || '作品'}</h2>
              </div>
            </div>

            {uploadedImage && (
              <button
                className="analyze-button ai-header-action"
                onClick={chatMessages.length > 0 ? handleRefreshChat : handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'AI分析中...' : (chatMessages.length > 0 ? '刷新聊天' : 'AI艺术讲解')}
              </button>
            )}

            <div className="ai-header-divider" aria-hidden="true" />
          </div>

          <div className="ai-content-grid">
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
            </div>

            <div className="artwork-info">
              {uiMode !== 'chat' && (
                <div className={`ai-intro-stack ${uiMode === 'intro-hiding' ? 'is-hiding' : ''}`}>
                  <div className="ai-prep-card">
                    {!uploadedImage ? (
                      <>
                        <h3>欢迎使用</h3>
                        <p>请先上传一幅艺术作品图片，然后点击“AI艺术讲解”开始讲解。</p>
                      </>
                    ) : (
                      <>
                        <h3>准备分析</h3>
                        <p>图片已就绪，点击“AI艺术讲解”开始生成讲解内容。</p>
                      </>
                    )}
                  </div>

                  <div className="ai-right-placeholder">
                    <h3>讲解内容将显示在此处</h3>
                    <p>开始分析后，这里会展示 AI 对作品的讲解，并支持继续追问对话。</p>
                  </div>

                  {analysisResult && !analysisResult.success && (
                    <div className="ai-analysis-error">
                      <h3>AI分析失败</h3>
                      <p>{analysisResult.error}</p>
                    </div>
                  )}
                </div>
              )}

              {chatMessages.length > 0 && (
                <div
                  className={`ai-chat-layer ${(uiMode === 'chat' || uiMode === 'intro-hiding') ? 'is-visible' : 'is-hidden'}`}
                >
                  <div className="ai-chat-container">
                    <h3>AI讲解与对话</h3>
                    <div className="chat-messages" ref={chatMessagesContainerRef}>
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                          <div className="message-label">{msg.role === 'user' ? '您' : 'AI助手'}</div>
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
                </div>
              )}

              {isAnalyzing && (
                <div className="ai-analyzing-overlay" role="status" aria-live="polite">
                  <div className="ai-analyzing">
                    <h3>正在分析中...</h3>
                    <div className="loading-spinner"></div>
                    <p>AI正在深入解读这幅作品，请稍候...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AIExplanationPage;
