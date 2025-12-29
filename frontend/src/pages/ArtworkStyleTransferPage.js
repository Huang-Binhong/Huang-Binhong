import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Download, Film, Image as ImageIcon, Info, PenTool, Search, X } from 'lucide-react';
import './StyleTransferPage.css';
import './ArtworkStyleTransferPage.css';

const THEME = {
  bgMain: '#F8F6F1',
  bgCard: '#EDE8DF',
  textDark: '#1F1B1A',
  textSubtle: '#4A403A',
  accentMain: '#D9CBA3',
  accentSubtle: '#A09778'
};

const isLikelyVideoUrl = (url) => {
  if (typeof url !== 'string') return false;
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return true;
  if (/video/i.test(url) && /^https?:\/\//i.test(url)) return true;
  if (/volces\.com.*content/i.test(url)) return true;
  return false;
};

const API_BASE = (() => {
  const envBase = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    if (window.location.port === '3000') return 'http://localhost:8080';
    return (window.location.origin || '').replace(/\/$/, '');
  }
  return '';
})();

async function readJsonOrText(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

function ArtworkStyleTransferPage() {
  const { id } = useParams();
  const location = useLocation();

  const [artwork, setArtwork] = useState(location.state?.artwork || null);
  const [loadingArtwork, setLoadingArtwork] = useState(!location.state?.artwork);

  const [targetImage, setTargetImage] = useState(null);
  const [targetFile, setTargetFile] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [resultReady, setResultReady] = useState(false);
  const [resultUrls, setResultUrls] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const stepTimer = useRef(null);

  const styleTags = useMemo(() => {
    if (!artwork?.collectionName) return '';
    return `参考作品《${artwork.collectionName}》`;
  }, [artwork?.collectionName]);

  useEffect(() => {
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
    };
  }, []);

  useEffect(() => {
    if (artwork) return;

    const fetchArtwork = async () => {
      setLoadingArtwork(true);
      try {
        const formData = new FormData();
        formData.append('infomationId', id);

        const response = await fetch(`${API_BASE}/frontend/pg/huang/get-dong-by-id`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.infomation && data.infomation.id) {
          setArtwork({
            id: data.infomation.id,
            collectionName: data.infomation.collectionName || '作品',
            image: `${API_BASE}/static/${data.smallPicSrc}`,
          });
        } else {
          setArtwork({
            id,
            collectionName: '作品',
            image: '/images/bg1.jpg',
          });
        }
      } catch (error) {
        console.error('获取作品信息失败:', error);
        setArtwork({
          id,
          collectionName: '作品',
          image: '/images/bg1.jpg',
        });
      } finally {
        setLoadingArtwork(false);
      }
    };

    fetchArtwork();
  }, [id, artwork]);

  const processFile = (file) => {
    if (!file) return;
    setTargetFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setTargetImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const startStepTicker = () => {
    const steps = ['分析内容...', '注入水墨笔意...', '细化皴擦肌理...', '最终润色...'];
    let stepIdx = 0;
    setLoadingStep(steps[0]);
    stepTimer.current = setInterval(() => {
      stepIdx += 1;
      if (stepIdx < steps.length) setLoadingStep(steps[stepIdx]);
    }, 900);
  };

  const stopStepTicker = () => {
    if (stepTimer.current) clearInterval(stepTimer.current);
    stepTimer.current = null;
    setLoadingStep('');
  };

  const handleGenerateImage = async () => {
    if (isGenerating) return;
    if (!targetFile) {
      alert('请先上传需要风格迁移的图片');
      return;
    }

    setIsGenerating(true);
    setResultReady(false);
    setResultUrls([]);
    startStepTicker();

    try {
      const formData = new FormData();
      formData.append('file', targetFile);
      if (styleTags) formData.append('style_tags', styleTags);
      formData.append('img_count', '1');

      const res = await fetch(`${API_BASE}/api/style-transfer/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await readJsonOrText(res);
        const detail = data?.detail || (typeof data === 'string' ? data : JSON.stringify(data));
        throw new Error(detail || '生成失败');
      }

      const data = await res.json();
      const urls = Array.isArray(data.urls) ? data.urls : [];
      if (!urls.length) throw new Error('未返回生成结果');
      setResultUrls(urls);
      setResultReady(true);
    } catch (err) {
      alert(`生成失败：${err.message || err}`);
    } finally {
      stopStepTicker();
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (isGenerating) return;
    if (!targetFile) {
      alert('请先上传需要风格迁移的图片（视频将基于该图片生成）');
      return;
    }

    setIsGenerating(true);
    setResultReady(false);
    setResultUrls([]);
    setLoadingStep('正在生成水墨画面...');

    try {
      const imageForm = new FormData();
      imageForm.append('file', targetFile);
      if (styleTags) imageForm.append('style_tags', styleTags);
      imageForm.append('img_count', '1');

      const imageRes = await fetch(`${API_BASE}/api/style-transfer/image`, {
        method: 'POST',
        body: imageForm,
      });
      if (!imageRes.ok) {
        const data = await readJsonOrText(imageRes);
        const detail = data?.detail || (typeof data === 'string' ? data : JSON.stringify(data));
        throw new Error(detail || '生成水墨画面失败');
      }

      const imageData = await imageRes.json();
      const imageUrls = Array.isArray(imageData.urls) ? imageData.urls : [];
      if (!imageUrls.length) throw new Error('未返回水墨画面 URL');

      const imageUrl = imageUrls[0];
      setResultUrls([imageUrl]);
      setResultReady(true);

      setLoadingStep('正在创建水墨动画任务...');
      const videoForm = new FormData();
      videoForm.append('image_url', imageUrl);
      if (styleTags) videoForm.append('style_tags', styleTags);

      const videoRes = await fetch(`${API_BASE}/api/style-transfer/video`, {
        method: 'POST',
        body: videoForm,
      });
      if (!videoRes.ok) {
        const data = await readJsonOrText(videoRes);
        const detail = data?.detail || (typeof data === 'string' ? data : JSON.stringify(data));
        throw new Error(detail || '创建水墨动画任务失败');
      }

      const videoData = await videoRes.json();
      const taskId = videoData.task_id || videoData.id;
      if (!taskId) throw new Error('未返回任务 ID');

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let finalVideoUrl = null;

      for (let attempt = 0; attempt < 40; attempt += 1) {
        setLoadingStep(`水墨动画生成中 (${attempt + 1}/40)，请稍候...`);

        const queryRes = await fetch(`${API_BASE}/api/style-transfer/video/${taskId}`);
        if (!queryRes.ok) {
          const data = await readJsonOrText(queryRes);
          const detail = data?.detail || (typeof data === 'string' ? data : JSON.stringify(data));
          throw new Error(detail || '查询水墨动画任务失败');
        }

        const queryData = await queryRes.json();
        const payload = queryData.data || queryData;
        const statusRaw = payload.status || payload.task_status || '';
        const status = typeof statusRaw === 'string' ? statusRaw.toLowerCase() : '';

        if (status.includes('fail') || status === 'error') {
          throw new Error(`水墨动画任务失败：${statusRaw || status}`);
        }

        const urls = [];
        const visit = (val) => {
          if (!val) return;
          if (typeof val === 'string') {
            if (isLikelyVideoUrl(val) && !urls.includes(val)) urls.push(val);
            return;
          }
          if (Array.isArray(val)) {
            val.forEach(visit);
            return;
          }
          if (typeof val === 'object') {
            const priorityKeys = ['video_url', 'videoUrl', 'url', 'output_url', 'result_url'];
            for (const pk of priorityKeys) {
              const candidate = val[pk];
              if (typeof candidate === 'string' && candidate.startsWith('http') && !urls.includes(candidate)) {
                urls.push(candidate);
              }
            }
            Object.values(val).forEach(visit);
          }
        };
        visit(payload);

        if (urls.length) {
          finalVideoUrl = urls[0];
          break;
        }

        await sleep(5000);
      }

      if (finalVideoUrl) {
        setResultUrls([finalVideoUrl]);
        setResultReady(true);
      } else {
        alert('水墨动画任务已提交，但暂未拿到视频地址，可稍后重试或查看后端日志');
      }
    } catch (err) {
      alert(`生成水墨动画失败：${err.message || err}`);
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setTargetImage(null);
    setTargetFile(null);
    setResultReady(false);
    setResultUrls([]);
    setPreviewUrl(null);
    setIsGenerating(false);
    stopStepTicker();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className="style-transfer-page notranslate"
      translate="no"
    >
      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>
      <div className="nav_logo3">
        <img src="/images/list_logo3.png" alt="" />
      </div>

      <Link to={`/artwork/${id}`} className="a_home">
        <img src="/images/a_home.png" alt="返回作品详情" />
      </Link>

      <div className="style_main">
        <div className="style_content">
          <header
            className="st-header"
            style={{ background: THEME.bgCard, borderColor: THEME.accentSubtle }}
          >
            <div className="st-header-left">
              <div className="st-icon-badge">
                <PenTool size={18} color={THEME.textDark} />
              </div>
              <div>
                <div className="st-title">作品参考 · 风格迁移</div>
                <div
                  className="st-title-badge"
                  style={{ borderColor: THEME.accentSubtle, color: THEME.textSubtle }}
                >
                  以详情页作品为参考图
                </div>
              </div>
            </div>
          </header>

          <div className="st-layout">
            <aside
              className="st-sidebar"
              style={{ background: THEME.bgCard, borderColor: THEME.accentSubtle }}
            >
              <div className="st-left-scroll">
                <div
                  className="st-card st-info"
                  style={{
                    background: THEME.bgMain,
                    borderColor: `${THEME.accentSubtle}80`,
                    color: THEME.textSubtle,
                  }}
                >
                  <Info size={16} />
                  <span>
                    <strong>使用方式：</strong> 左侧参考作品已固定，上传待迁移图片后即可生成风格图或水墨动画。
                  </span>
                </div>

                <section className="st-card">
                  <div
                    className="st-section-title"
                    style={{ borderColor: `${THEME.accentSubtle}50`, color: THEME.textSubtle }}
                  >
                    <span>1. 参考作品（自动）</span>
                  </div>
                  <div className="st-preview ast-ref-preview">
                    {loadingArtwork ? (
                      <div className="st-dropzone-empty">
                        <div
                          className="st-circle"
                          style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
                        >
                          <ImageIcon size={24} color={THEME.accentMain} />
                        </div>
                        <p>正在加载参考作品...</p>
                      </div>
                    ) : (
                      <img
                        src={artwork?.image || '/images/bg1.jpg'}
                        alt={artwork?.collectionName || '参考作品'}
                        onError={(e) => {
                          e.target.src = '/images/bg1.jpg';
                        }}
                      />
                    )}
                  </div>
                  {!!styleTags && <div className="st-hint-line ast-tag">#{styleTags}</div>}
                </section>

                <section className="st-card">
                  <div
                    className="st-section-title"
                    style={{ borderColor: `${THEME.accentSubtle}50`, color: THEME.textSubtle }}
                  >
                    <span>2. 待迁移图片（必选）</span>
                  </div>
                  <div
                    className="st-dropzone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{
                      borderColor: `${THEME.accentSubtle}60`,
                      background: THEME.bgMain,
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="st-file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {!targetImage ? (
                      <div className="st-dropzone-empty">
                        <div
                          className="st-circle"
                          style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
                        >
                          <ImageIcon size={24} color={THEME.accentMain} />
                        </div>
                        <p>上传需要风格迁移的图片</p>
                        <p className="st-hint">支持 JPG, PNG (Max 10MB)</p>
                      </div>
                    ) : (
                      <div className="st-preview">
                        <img src={targetImage} alt="待迁移图片预览" />
                        <button
                          type="button"
                          className="st-close-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                <div className="st-actions" style={{ borderColor: `${THEME.accentSubtle}50` }}>
                  <button
                    type="button"
                    className="st-btn primary"
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    style={{ background: THEME.accentMain, color: THEME.textDark }}
                  >
                    <PenTool size={16} /> 生成风格图
                  </button>
                  <button
                    type="button"
                    className="st-btn"
                    onClick={handleGenerateVideo}
                    disabled={isGenerating}
                    style={{ background: THEME.bgMain, color: THEME.textDark }}
                  >
                    <Film size={16} /> 生成水墨动画
                  </button>
                </div>
              </div>
            </aside>

            <main className="st-main" style={{ background: THEME.bgMain }}>
              <div className="st-main-inner">
                {!isGenerating && !resultReady && (
                  <div className="st-state st-state-idle">
                    <div
                      className="st-circle-large"
                      style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
                    >
                      <PenTool size={44} color={THEME.accentMain} />
                    </div>
                    <h2 className="st-state-title">等待创作</h2>
                    <p className="st-state-desc">上传图片后，点击“生成风格图”或“生成水墨动画”。</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="st-state st-state-loading">
                    <div className="st-loading-ring">
                      <div className="animate-ping" style={{ background: THEME.accentMain }} />
                      <div
                        className="st-loading-core"
                        style={{ background: THEME.bgCard, borderColor: THEME.bgMain }}
                      >
                        <PenTool size={32} style={{ color: THEME.accentSubtle }} />
                      </div>
                    </div>
                    <h3 className="st-state-title">正在挥毫泼墨...</h3>
                    <p className="st-state-desc">{loadingStep}</p>
                    <div className="st-progress">
                      <div className="st-progress-bar" style={{ background: THEME.accentMain }} />
                    </div>
                  </div>
                )}

                {resultReady && !isGenerating && (
                  <div className="st-result animate-fade-in">
                    <div className="st-result-header">
                      <h3 className="st-state-title">
                        <span style={{ color: THEME.accentMain }}>◼</span> 作品完成
                      </h3>
                    </div>
                    <div className="st-result-grid">
                      {resultUrls.map((url, idx) => (
                        <div
                          key={url + idx}
                          className="st-result-card"
                          style={{ borderColor: `${THEME.accentMain}50`, background: THEME.bgCard }}
                        >
                          {isLikelyVideoUrl(url) ? (
                            <video
                              src={url}
                              className="st-result-img"
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls
                            />
                          ) : (
                            <img src={url} alt={`Result ${idx + 1}`} className="st-result-img" />
                          )}
                          <div className="st-result-mask" style={{ background: `${THEME.bgMain}e6` }}>
                            <button
                              type="button"
                              className="st-btn ghost"
                              onClick={() => setPreviewUrl(url)}
                            >
                              <Search size={16} /> 细览
                            </button>
                            <a
                              className="st-btn primary"
                              style={{ background: THEME.accentMain, color: THEME.textDark }}
                              href={url}
                              download
                            >
                              <Download size={16} /> 收藏
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="st-preview-overlay" onClick={() => setPreviewUrl(null)}>
          <div
            className="st-preview-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ background: THEME.bgMain }}
          >
            <button type="button" className="st-preview-close" onClick={() => setPreviewUrl(null)}>
              <X size={18} />
            </button>
            <div className="st-preview-body">
              {isLikelyVideoUrl(previewUrl) ? (
                <video
                  src={previewUrl}
                  className="st-preview-full"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img src={previewUrl} alt="生成作品大图" className="st-preview-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtworkStyleTransferPage;
