import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Film,
  PenTool,
  RotateCcw,
  Download,
  X,
  Search,
  Settings,
  HelpCircle,
  Loader2,
  Info,
  Pen
} from 'lucide-react';
import './StyleTransferPage.css';

const BG_IMAGES = ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];

const THEME = {
  bgMain: '#F8F6F1',
  bgCard: '#EDE8DF',
  textDark: '#1F1B1A',
  textSubtle: '#4A403A',
  accentMain: '#D9CBA3',
  accentSubtle: '#A09778'
};

const STYLE_TAGS = {
  早期: ['清雅浅淡', '江南烟雨', '留白疏朗'],
  中期: ['积墨山川', '浑厚华滋', '写生并重'],
  晚期: ['黑密厚重', '枯笔飞白', '气韵苍浑']
};

const API_BASE = (() => {
  const envBase = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    // 开发时前端跑在 3000 端口，后端默认 8000
    if (window.location.port === '3000') return 'http://localhost:8000';
    return (window.location.origin || '').replace(/\/$/, '');
  }
  return '';
})();

function StyleTransferPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('image'); // 'image' | 'video'
  const [inkStyle, setInkStyle] = useState('thick');
  const [videoMotion, setVideoMotion] = useState('diffusion');
  const [videoDuration, setVideoDuration] = useState(5);
  const [imgCount, setImgCount] = useState(1);
  const [strength, setStrength] = useState(0.8);
  const [styleTags, setStyleTags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [resultReady, setResultReady] = useState(false);
  const [resultUrls, setResultUrls] = useState([]);

  const fileInputRef = useRef(null);
  const stepTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    return () => {
      if (stepTimer.current) {
        clearInterval(stepTimer.current);
      }
    };
  }, []);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSourceFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSourceImage(e.target.result);
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

  const handleGenerate = () => {
    if (!sourceFile) {
      alert('请先上传参考底图，这是生成黄宾虹风格的基础。');
      return;
    }
    if (mode === 'video') {
      alert('当前仅对接图生图接口，图生视频需提供可访问的 image_url，后续接入对象存储后再开放。');
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setResultReady(false);
    setResultUrls([]);

    const steps = [
      '分析原图构图...',
      '注入浑厚华滋意境...',
      '细化水墨笔触...',
      '最终装裱...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    stepTimer.current = setInterval(() => {
      stepIdx += 1;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 800);

    const formData = new FormData();
    formData.append('file', sourceFile);
    formData.append('prompt', prompt);
    formData.append('ink_style', inkStyle);
    formData.append('style_tags', styleTags.join(','));
    formData.append('img_count', String(imgCount));

    fetch(`${API_BASE}/api/style-transfer/image`, {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const data = await res.json();
              const detail = data?.detail || JSON.stringify(data);
              throw new Error(detail || '生成失败');
            }
            const text = await res.text();
            throw new Error(text || '生成失败');
        }
        return res.json();
      })
      .then((data) => {
        const urls = Array.isArray(data.urls) ? data.urls : [];
        if (!urls.length) throw new Error('未返回生成结果');
        setResultUrls(urls);
        setResultReady(true);
      })
      .catch((err) => {
        alert(`生成失败：${err.message || err}`);
      })
      .finally(() => {
        if (stepTimer.current) {
          clearInterval(stepTimer.current);
        }
        setIsGenerating(false);
        setLoadingStep('');
      });
  };

  const handleReset = () => {
    setSourceImage(null);
    setSourceFile(null);
    setPrompt('');
    setStrength(0.8);
    setStyleTags([]);
    setResultReady(false);
    setIsGenerating(false);
    setLoadingStep('');
    setResultUrls([]);
  };

  const sampleImage =
    sourceImage ||
    'https://images.unsplash.com/photo-1518331320496-6e27b2b53b82?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="style-transfer-page notranslate"
      translate="no"
      style={{
        backgroundImage: `url(${BG_IMAGES[currentBg]})`
      }}
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

      <Link to="/" className="a_home">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      <div className="style_main">
        <div className="breadcrumb">首页 / 创作 / AI风格迁移</div>

        <div className="style_content">
          <header className="st-header" style={{ background: THEME.bgCard, borderColor: THEME.accentSubtle }}>
            <div className="st-header-left">
              <div className="st-icon-badge">
                <PenTool size={18} color={THEME.textDark} />
              </div>
              <div>
                <div className="st-title">黄宾虹画意生成器</div>
                <div className="st-title-badge" style={{ borderColor: THEME.accentSubtle, color: THEME.textSubtle }}>
                  风格重绘版
                </div>
              </div>
            </div>
            <div className="st-header-actions" style={{ color: THEME.textSubtle }}>
              <button className="st-icon-btn">
                <Settings size={18} />
              </button>
              <button className="st-icon-btn">
                <HelpCircle size={18} />
              </button>
              <div className="st-avatar" style={{ background: THEME.bgMain, borderColor: `${THEME.accentSubtle}50` }}>
                U
              </div>
            </div>
          </header>

          <div className="st-layout">
            <aside className="st-sidebar" style={{ background: THEME.bgCard, borderColor: THEME.accentSubtle }}>
              <div
                className="st-card st-info"
                style={{ background: THEME.bgMain, borderColor: `${THEME.accentSubtle}80`, color: THEME.textSubtle }}
              >
                <Info size={16} />
                <span>
                  <strong>风格转换：</strong> 上传照片，AI 将基于原图构图，重绘为“浑厚华滋”的黄宾虹水墨风格。
                </span>
              </div>

              <section className="st-card">
                <div className="st-section-title" style={{ borderColor: `${THEME.accentSubtle}50`, color: THEME.textSubtle }}>
                  <span>1. 参考底图 (必选)</span>
                </div>
                <div
                  className="st-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{
                    borderColor: `${THEME.accentSubtle}60`,
                    background: THEME.bgMain
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="st-file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {!sourceImage ? (
                    <div className="st-dropzone-empty">
                      <div className="st-circle" style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}>
                        <ImageIcon size={24} color={THEME.accentMain} />
                      </div>
                      <p>上传风景/人物照片</p>
                      <p className="st-hint">支持 JPG, PNG (Max 10MB)</p>
                    </div>
                  ) : (
                    <div className="st-preview">
                      <img src={sourceImage} alt="Preview" />
                      <button
                        className="st-close-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSourceImage(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section className="st-card">
                <div className="st-section-title" style={{ borderColor: `${THEME.accentSubtle}50`, color: THEME.textSubtle }}>
                  <span>2. 意境微调 (选填)</span>
                </div>
                <textarea
                  rows="3"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="st-textarea"
                  placeholder="补充画面细节，如“添加飞鸟”或“改为雨后山景”..."
                  style={{ background: THEME.bgMain, color: THEME.textDark, borderColor: `${THEME.accentSubtle}50` }}
                />
                <div className="st-hint-line" style={{ color: THEME.textSubtle }}>
                  <Info size={12} /> 提示：无需描述整体画面，只需补充想要的变化。
                </div>
              </section>

              <section className="st-card st-settings">
                <div className="st-section-title" style={{ borderColor: `${THEME.accentSubtle}50`, color: THEME.textSubtle }}>
                  <span>3. 创作设置</span>
                </div>

                <div className="st-toggle-row">
                  <button
                    className={`st-toggle ${mode === 'image' ? 'active' : ''}`}
                    onClick={() => setMode('image')}
                    style={
                      mode === 'image'
                        ? { background: THEME.accentMain, color: THEME.textDark }
                        : { background: THEME.bgCard, color: THEME.textDark, borderColor: THEME.bgCard }
                    }
                  >
                    <PenTool size={16} /> 风格生图
                  </button>
                  <button
                    className={`st-toggle ${mode === 'video' ? 'active' : ''}`}
                    onClick={() => setMode('video')}
                    style={
                      mode === 'video'
                        ? { background: THEME.accentMain, color: THEME.textDark }
                        : { background: THEME.bgCard, color: THEME.textDark, borderColor: THEME.bgCard }
                    }
                  >
                    <Film size={16} /> 水墨动画
                  </button>
                </div>

                {mode === 'image' ? (
                  <div className="st-grid">
                    <div>
                      <label className="st-label">墨气风格</label>
                      <div className="st-chip-row">
                        {['thick', 'dry', 'light'].map((s) => (
                          <button
                            key={s}
                            className={`st-chip ${inkStyle === s ? 'active' : ''}`}
                            onClick={() => setInkStyle(s)}
                          >
                            {s === 'thick' ? '浑厚华滋' : s === 'dry' ? '干裂秋风' : '淡墨清韵'}
                          </button>
                        ))}
                      </div>
                      <p className="st-mini-hint">注：晚年画风多黑密厚重（浑厚华滋）。</p>
                    </div>
                    <div>
                      <label className="st-label">生成数量</label>
                      <div className="st-chip-row">
                        {[1, 2, 4].map((n) => (
                          <button
                            key={n}
                            className={`st-chip ${imgCount === n ? 'active' : ''}`}
                            onClick={() => setImgCount(n)}
                          >
                            {n} 张
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="st-grid">
                    <div>
                      <label className="st-label">画卷动态</label>
                      <div className="st-chip-row">
                        {['diffusion', 'parallax'].map((m) => (
                          <button
                            key={m}
                            className={`st-chip ${videoMotion === m ? 'active' : ''}`}
                            onClick={() => setVideoMotion(m)}
                          >
                            {m === 'diffusion' ? '水墨晕染' : '层峦推移'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="st-label">生成时长</label>
                      <div className="st-chip-row">
                        {[3, 5].map((d) => (
                          <button
                            key={d}
                            className={`st-chip ${videoDuration === d ? 'active' : ''}`}
                            onClick={() => setVideoDuration(d)}
                          >
                            {d} 秒
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="st-label">风格时期标签（可多选）</label>
                  {Object.entries(STYLE_TAGS).map(([period, tags]) => (
                    <div key={period} className="st-chip-group">
                      <div className="st-chip-group-title">{period}</div>
                      <div className="st-chip-row">
                        {tags.map((tag) => {
                          const active = styleTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              className={`st-chip ${active ? 'active' : ''}`}
                              onClick={() =>
                                setStyleTags((prev) =>
                                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                                )
                              }
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <p className="st-mini-hint">提示：按时期选择标签，可更精准地映射到对应笔墨与构图风格。</p>
                </div>

                <div className="st-slider-wrap">
                  <div className="st-slider-top">
                    <label className="st-label">原图保留度</label>
                    <span className="st-slider-value">{strength.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    className="st-slider"
                  />
                  <div className="st-slider-hint">
                    <span>更写意</span>
                    <span>严格结构</span>
                  </div>
                </div>
              </section>

              <div className="st-actions" style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}>
                <button className="st-btn ghost" onClick={handleReset}>
                  <RotateCcw size={18} /> 重置
                </button>
                <button
                  className="st-btn primary"
                  onClick={handleGenerate}
                  disabled={isGenerating || !sourceImage}
                  style={{ background: THEME.accentMain, color: THEME.textDark }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> 泼墨中...
                    </>
                  ) : (
                    <>
                      <span>立即重绘</span> <Pen size={18} />
                    </>
                  )}
                </button>
              </div>
            </aside>

            <main className="st-main" style={{ background: THEME.bgMain }}>
              <div className="st-main-inner">
                {!isGenerating && !resultReady && (
                  <div className="st-state st-state-idle">
                    <div className="st-circle-large" style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}>
                      <PenTool size={44} color={THEME.accentMain} />
                    </div>
                    <h2 className="st-state-title">丹青待发</h2>
                    <p className="st-state-desc">请上传底图，AI 将为您呈现黄宾虹笔下的山水意境。</p>
                    <div className="st-chip-row center">
                      <span className="st-chip subtle">#积墨法</span>
                      <span className="st-chip subtle">#黑密厚重</span>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="st-state st-state-loading">
                    <div className="st-loading-ring">
                      <div className="animate-ping" style={{ background: THEME.accentMain }} />
                      <div className="st-loading-core" style={{ background: THEME.bgCard, borderColor: THEME.bgMain }}>
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
                        <span style={{ color: THEME.accentMain }}>●</span> 作品完成
                      </h3>
                      <span className="st-chip subtle">耗时 3.5s</span>
                    </div>
                    <div className="st-result-grid">
                      {resultUrls.length
                        ? resultUrls.map((url, idx) => (
                            <div
                              key={url + idx}
                              className="st-result-card"
                              style={{ borderColor: `${THEME.accentMain}50`, background: THEME.bgCard }}
                            >
                              <img
                                src={url}
                                alt={`Result ${idx + 1}`}
                                className="st-result-img"
                              />
                              <div className="st-result-mask" style={{ background: `${THEME.bgMain}e6` }}>
                                <a
                                  className="st-btn ghost"
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Search size={16} /> 细赏
                                </a>
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
                          ))
                        : (
                          <div className="st-result-card" style={{ borderColor: `${THEME.accentMain}50`, background: THEME.bgCard }}>
                            <img
                              src={sampleImage}
                              alt="Result placeholder"
                              className="st-result-img"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

    </div>
  );
}

export default StyleTransferPage;
