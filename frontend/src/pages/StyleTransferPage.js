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
  Pen,
  History,
  BarChart2,
  Share2
} from 'lucide-react';
import './StyleTransferPage.css';

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

const isVideoUrl = (url) =>
  typeof url === 'string' && /\.(mp4|webm|mov)(\?|$)/i.test(url);

// 更宽松的视频 URL 检测，适配豆包 API 返回格式
const isLikelyVideoUrl = (url) => {
  if (typeof url !== 'string') return false;
  // 先检查严格的视频扩展名
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return true;
  // 豆包 API 可能返回不带扩展名的视频 URL，检查是否包含 video 关键词
  if (/video/i.test(url) && /^https?:\/\//i.test(url)) return true;
  // 检查常见的视频 CDN 域名模式
  if (/volces\.com.*content/i.test(url)) return true;
  return false;
};

const API_BASE = (() => {
  const envBase = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    // 开发时前端跑在 3000 端口，后端默认 8080
    if (window.location.port === '3000') return 'http://localhost:8080';
    return (window.location.origin || '').replace(/\/$/, '');
  }
  return '';
})();

function StyleTransferPage() {
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);

  const totalHistoryCount = historyItems.length;
  const imageHistoryCount = historyItems.filter((h) => h.type === 'image').length;
  const videoHistoryCount = historyItems.filter((h) => h.type === 'video').length;
  const imageRatio = totalHistoryCount > 0 ? (imageHistoryCount / totalHistoryCount) * 100 : 0;
  const videoRatio = totalHistoryCount > 0 ? (videoHistoryCount / totalHistoryCount) * 100 : 0;
  const usageData = {
    totalCount: totalHistoryCount,
    totalImageCount: imageHistoryCount,
    totalVideoCount: videoHistoryCount,
    typeBreakdown: [
      { type: 'image', label: '风格生图', count: imageHistoryCount, color: THEME.accentSubtle },
      { type: 'video', label: '水墨动画', count: videoHistoryCount, color: THEME.textSubtle },
    ],
  };

  const fileInputRef = useRef(null);
  const stepTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (stepTimer.current) {
        clearInterval(stepTimer.current);
      }
    };
  }, []);

  const processFile = (file) => {
    if (!file) return;
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
    if (isGenerating) return;

    if (mode === 'image') {
      if (!sourceFile) {
        alert('请先上传参考底图，这是生成黄宾虹风格的基础。');
        return;
      }

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
      formData.append('strength', String(strength));

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
          setHistoryItems((prev) => [
            {
              id: `${Date.now()}-${prev.length + 1}`,
              type: 'image',
              mode: 'image',
              urls,
              createdAt: new Date().toISOString(),
              prompt,
              inkStyle,
              styleTags,
            },
            ...prev,
          ]);
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
      return;
    }

    // 图生视频：基于已生成的风格图像 URL 提交任务
    if (!resultUrls.length) {
      alert('请先生成风格图片，再生成水墨动画。');
      return;
    }

    setIsGenerating(true);
    setLoadingStep('创建水墨动画任务...');

    const videoForm = new FormData();
    videoForm.append('image_url', resultUrls[0]); // 取第一张生成图作为视频底图
    videoForm.append('prompt', prompt);
    videoForm.append('ink_style', inkStyle);
    videoForm.append('style_tags', styleTags.join(','));
    videoForm.append('video_motion', videoMotion);
    videoForm.append('video_duration', String(videoDuration));
    videoForm.append('strength', String(strength));

    fetch(`${API_BASE}/api/style-transfer/video`, {
      method: 'POST',
      body: videoForm,
    })
      .then(async (res) => {
        if (!res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            const detail = data?.detail || JSON.stringify(data);
            throw new Error(detail || '创建视频任务失败');
          }
          const text = await res.text();
          throw new Error(text || '创建视频任务失败');
        }
        return res.json();
      })
      .then((data) => {
        const taskId = data.task_id || data.id;
        if (taskId) {
          alert(`已提交水墨动画任务，任务 ID：${taskId}`);
        } else {
          alert('已提交水墨动画请求，但未返回任务 ID，请检查后端日志。');
        }
      })
      .catch((err) => {
        alert(`创建水墨动画失败：${err.message || err}`);
      })
      .finally(() => {
        setIsGenerating(false);
        setLoadingStep('');
      });
  };

  const handleGenerateVideo = async () => {
    if (isGenerating) return;

    if (!sourceFile) {
      alert('请先上传参考底图，这是生成水墨动画的基础。');
      return;
    }

    setIsGenerating(true);
    setResultReady(false);
    setResultUrls([]);
    setLoadingStep('正在生成水墨画面...');

    try {
      // 1. 先用当前底图生成一张水墨画面
      const imageForm = new FormData();
      imageForm.append('file', sourceFile);
      imageForm.append('prompt', prompt);
      imageForm.append('ink_style', inkStyle);
      imageForm.append('style_tags', styleTags.join(','));
      imageForm.append('img_count', '1');
      imageForm.append('strength', String(strength));

      const imageRes = await fetch(`${API_BASE}/api/style-transfer/image`, {
        method: 'POST',
        body: imageForm,
      });

      if (!imageRes.ok) {
        const contentType = imageRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await imageRes.json();
          const detail = data?.detail || JSON.stringify(data);
          throw new Error(detail || '生成水墨画面失败');
        }
        const text = await imageRes.text();
        throw new Error(text || '生成水墨画面失败');
      }

      const imageData = await imageRes.json();
      const imageUrls = Array.isArray(imageData.urls) ? imageData.urls : [];
      if (!imageUrls.length) {
        throw new Error('未返回水墨画面 URL');
      }

      const imageUrl = imageUrls[0];
      // 可以先用这张图占位，等视频好了再替换
      setResultUrls([imageUrl]);
      setResultReady(true);

      // 2. 创建水墨动画任务
      setLoadingStep('正在创建水墨动画任务...');

      const videoForm = new FormData();
      videoForm.append('image_url', imageUrl);
      videoForm.append('prompt', prompt);
      videoForm.append('ink_style', inkStyle);
      videoForm.append('style_tags', styleTags.join(','));
      videoForm.append('video_motion', videoMotion);
      videoForm.append('video_duration', String(videoDuration));
      videoForm.append('strength', String(strength));

      const videoRes = await fetch(`${API_BASE}/api/style-transfer/video`, {
        method: 'POST',
        body: videoForm,
      });

      if (!videoRes.ok) {
        const contentType = videoRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await videoRes.json();
          const detail = data?.detail || JSON.stringify(data);
          throw new Error(detail || '创建水墨动画任务失败');
        }
        const text = await videoRes.text();
        throw new Error(text || '创建水墨动画任务失败');
      }

      const videoData = await videoRes.json();
      const taskId = videoData.task_id || videoData.id;
      if (!taskId) {
        throw new Error('已提交水墨动画请求，但未返回任务 ID，请检查后台日志。');
      }

      // 3. 轮询查询任务结果，拿到真正的视频地址
      setLoadingStep('水墨动画生成中，请稍候...');

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let finalVideoUrl = null;

      // 增加轮询次数到 40 次，每次 5 秒，共 200 秒 (约 3 分钟)
      for (let attempt = 0; attempt < 40; attempt += 1) {
        setLoadingStep(`水墨动画生成中 (${attempt + 1}/40)，请稍候...`);

        const queryRes = await fetch(`${API_BASE}/api/style-transfer/video/${taskId}`);
        if (!queryRes.ok) {
          const contentType = queryRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await queryRes.json();
            const detail = data?.detail || JSON.stringify(data);
            throw new Error(detail || '查询水墨动画任务失败');
          }
          const text = await queryRes.text();
          throw new Error(text || '查询水墨动画任务失败');
        }

        const queryData = await queryRes.json();
        const payload = queryData.data || queryData;
        const statusRaw = payload.status || payload.task_status || '';
        const status = typeof statusRaw === 'string' ? statusRaw.toLowerCase() : '';

        if (status.includes('fail') || status === 'error') {
          throw new Error(`水墨动画任务失败：${statusRaw || status}`);
        }

        // 检查是否已完成
        const isCompleted = status.includes('success') || status.includes('complete') || status === 'done';

        // 在返回结构里尽力搜寻视频地址
        const urls = [];
        const visit = (val, key = '') => {
          if (!val) return;
          if (typeof val === 'string') {
            // 使用更宽松的检测逻辑
            if (isLikelyVideoUrl(val) && !urls.includes(val)) {
              urls.push(val);
            }
            return;
          }
          if (Array.isArray(val)) {
            val.forEach((item, idx) => visit(item, `${key}[${idx}]`));
          } else if (typeof val === 'object') {
            // 优先检查常见的视频 URL 字段
            const priorityKeys = ['video_url', 'videoUrl', 'url', 'output_url', 'result_url'];
            for (const pk of priorityKeys) {
              if (val[pk] && typeof val[pk] === 'string' && val[pk].startsWith('http')) {
                if (!urls.includes(val[pk])) {
                  urls.push(val[pk]);
                }
              }
            }
            Object.entries(val).forEach(([k, v]) => visit(v, k));
          }
        };

        visit(payload);

        if (urls.length) {
          finalVideoUrl = urls[0];
          break;
        }

        // 如果状态显示完成但没找到 URL，再多尝试几次
        if (isCompleted && attempt > 2) {
          console.warn('任务状态显示完成，但未找到视频 URL，返回数据:', JSON.stringify(payload));
          break;
        }

        // 若还没结果，稍等再查 (5 秒)
        await sleep(5000);
      }

      if (finalVideoUrl) {
        setResultUrls([finalVideoUrl]);
        setResultReady(true);
        setHistoryItems((prev) => [
          {
            id: `${Date.now()}-${prev.length + 1}`,
            type: 'video',
            mode: 'video',
            urls: [finalVideoUrl],
            createdAt: new Date().toISOString(),
            prompt,
            inkStyle,
            styleTags,
          },
          ...prev,
        ]);
      } else {
        alert('水墨动画任务已提交，但暂未拿到视频地址，可稍后重试或在后台查询任务。');
      }
    } catch (err) {
      alert(`创建水墨动画失败：${err.message || err}`);
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sampleImage =
    sourceImage ||
    'https://images.unsplash.com/photo-1518331320496-6e27b2b53b82?q=80&w=1000&auto=format&fit=crop';

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

      <Link to="/" className="a_home">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      <div className="style_main">
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
              <button
                type="button"
                className="st-link-btn"
                onClick={() => setShowHistoryModal(true)}
              >
                <History size={16} style={{ marginRight: 4 }} /> 历史
              </button>
              <div className="st-divider" style={{ background: `${THEME.textSubtle}40` }} />
              <button
                type="button"
                className="st-link-btn"
                onClick={() => setShowUsageModal(true)}
              >
                <BarChart2 size={16} style={{ marginRight: 4 }} /> 用量
              </button>
            </div>
          </header>

          <div className="st-layout">
            <aside className="st-sidebar" style={{ background: THEME.bgCard, borderColor: THEME.accentSubtle }}>
              <div className="st-left-scroll">
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
                            setSourceFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
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
              </div>

              <div className="st-actions" style={{ background: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}>
                <button className="st-btn ghost" onClick={handleReset}>
                  <RotateCcw size={18} /> 重置
                </button>
                  <button
                    className="st-btn primary"
                    onClick={mode === 'video' ? handleGenerateVideo : handleGenerate}
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
                              {isVideoUrl(url) ? (
                                <video
                                  src={url}
                                  className="st-result-img"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                              ) : (
                                <img
                                  src={url}
                                  alt={`Result ${idx + 1}`}
                                  className="st-result-img"
                                />
                              )}
                              <div className="st-result-mask" style={{ background: `${THEME.bgMain}e6` }}>
                                <button
                                  type="button"
                                  className="st-btn ghost"
                                  onClick={() => setPreviewUrl(url)}
                                >
                                  <Search size={16} /> 细赏
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

      {previewUrl && (
        <div className="st-preview-overlay" onClick={() => setPreviewUrl(null)}>
          <div
            className="st-preview-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ background: THEME.bgMain }}
          >
            <button
              type="button"
              className="st-preview-close"
              onClick={() => setPreviewUrl(null)}
            >
              <X size={18} />
            </button>
            <div className="st-preview-body">
              {isVideoUrl(previewUrl) ? (
                <video
                  src={previewUrl}
                  className="st-preview-full"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="生成作品大图"
                  className="st-preview-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div
          className="st-modal-backdrop"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="st-modal"
            style={{ backgroundColor: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 py-4 border-b flex justify-between items-center"
              style={{ backgroundColor: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
            >
              <h2 className="text-xl font-bold flex items-center gap-3">
                <History size={20} style={{ color: THEME.accentSubtle }} />
                <span style={{ fontFamily: '"Noto Serif SC", serif' }}>墨海寻迹 (创作历史)</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: THEME.textSubtle }}
              >
                <X size={20} />
              </button>
            </div>
            <div
              className="p-6 overflow-y-auto space-y-4"
              style={{ backgroundColor: THEME.bgMain }}
            >
              <p className="text-sm" style={{ color: THEME.textSubtle }}>
                此乃您在 AI 笔下留下的丹青墨痕。
              </p>

              {historyItems.length === 0 ? (
                <div
                  className="text-center py-10"
                  style={{ color: THEME.accentSubtle }}
                >
                  <Info size={30} className="mx-auto mb-2" />
                  <p>尚无作品，请开始您的水墨创作。</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {historyItems
                    .filter((item) => Array.isArray(item.urls) && item.urls[0])
                    .map((item) => {
                      const created = new Date(item.createdAt);
                      const timeLabel = `${created.getFullYear()}-${(created.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${created
                        .getDate()
                        .toString()
                        .padStart(2, '0')} ${created
                        .getHours()
                        .toString()
                        .padStart(2, '0')}:${created
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')}`;
                      const isVideo = item.type === 'video' || item.mode === 'video';
                      const firstUrl = item.urls[0];
                      return (
                        <div
                          key={item.id}
                          className="flex items-center rounded-xl p-3 shadow-md border hover:shadow-lg transition-all"
                          style={{
                            backgroundColor: THEME.bgCard,
                            borderColor: `${THEME.accentSubtle}30`,
                            cursor: firstUrl ? 'pointer' : 'default',
                          }}
                          onClick={() => {
                            if (firstUrl) setPreviewUrl(firstUrl);
                          }}
                        >
                          <div
                            className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden relative mr-4 border"
                            style={{ borderColor: THEME.accentMain }}
                          >
                            {isVideo ? (
                              <Film
                                size={28}
                                className="absolute inset-0 m-auto opacity-50"
                                style={{ color: THEME.accentSubtle }}
                              />
                            ) : (
                              <ImageIcon
                                size={28}
                                className="absolute inset-0 m-auto opacity-50"
                                style={{ color: THEME.accentSubtle }}
                              />
                            )}
                            <div
                              className="absolute inset-0 opacity-50"
                              style={{
                                backgroundImage: `url(${firstUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-base truncate"
                              style={{ color: THEME.textDark }}
                            >
                              {item.prompt ||
                                (isVideo ? '山水动画长卷' : '浑厚山水画作')}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: THEME.textSubtle }}
                            >
                              <span
                                className="px-1 rounded-sm text-[10px] font-semibold mr-2 border"
                                style={{
                                  borderColor: THEME.accentSubtle,
                                  backgroundColor: THEME.bgMain,
                                }}
                              >
                                {isVideo ? '水墨动画' : '风格生图'}
                              </span>
                              创作于 {timeLabel}
                            </p>
                          </div>

                          {firstUrl && (
                            <div className="ml-4 flex gap-2 flex-shrink-0">
                              <a
                                href={firstUrl}
                                download
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                style={{ color: THEME.accentSubtle }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <div
              className="px-6 py-4 border-t text-right"
              style={{
                borderColor: `${THEME.accentSubtle}50`,
                backgroundColor: THEME.bgCard,
              }}
            >
              <button
                type="button"
                className="px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => setShowHistoryModal(false)}
                style={{
                  backgroundColor: `${THEME.accentSubtle}30`,
                  color: THEME.textDark,
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showUsageModal && (
        <div
          className="st-modal-backdrop"
          onClick={() => setShowUsageModal(false)}
        >
          <div
            className="st-modal"
            style={{ backgroundColor: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 py-4 border-b flex justify-between items-center"
              style={{ backgroundColor: THEME.bgCard, borderColor: `${THEME.accentSubtle}50` }}
            >
              <h2 className="text-xl font-bold flex items-center gap-3">
                <BarChart2 size={20} style={{ color: THEME.accentSubtle }} />
                <span style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  墨宝清单 (创作统计)
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowUsageModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: THEME.textSubtle }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="p-6 overflow-y-auto space-y-6"
              style={{ backgroundColor: THEME.bgMain }}
            >
              <div
                className="p-6 rounded-xl shadow-xl border-l-8"
                style={{
                  backgroundColor: THEME.bgCard,
                  borderColor: THEME.accentMain,
                }}
              >
                <div
                  className="text-sm font-bold uppercase mb-3"
                  style={{ color: THEME.textSubtle }}
                >
                  历史总创作数 (Total Creations)
                </div>
                <div className="flex items-baseline justify-between">
                  <div
                    className="text-6xl font-extrabold"
                    style={{ color: THEME.textDark }}
                  >
                    {usageData.totalCount}
                    <span
                      className="text-2xl font-normal ml-2"
                      style={{ color: THEME.accentSubtle }}
                    >
                      幅
                    </span>
                  </div>
                  <PenTool
                    size={40}
                    style={{ color: THEME.accentSubtle }}
                    className="opacity-50"
                  />
                </div>
                <p
                  className="text-xs mt-3"
                  style={{ color: THEME.textSubtle }}
                >
                  这是您在黄宾虹画意生成器中累计创作的总量。
                </p>
              </div>

              <div
                className="p-5 rounded-xl shadow-lg border"
                style={{
                  backgroundColor: THEME.bgCard,
                  borderColor: `${THEME.accentSubtle}50`,
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: THEME.textDark }}
                >
                  创作类型占比
                </h3>

                <div
                  className="relative w-full h-8 rounded-full overflow-hidden mb-4 shadow-inner"
                  style={{ backgroundColor: THEME.textSubtle }}
                >
                  <div
                    className="absolute left-0 top-0 h-full flex items-center justify-center"
                    style={{
                      width: `${imageRatio}%`,
                      backgroundColor: THEME.accentSubtle,
                      transition: 'width 0.7s ease-out',
                    }}
                  >
                    {imageRatio > 10 && (
                      <span className="text-xs font-bold text-white pr-2">
                        {imageRatio.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {videoRatio > 10 && (
                    <div
                      className="absolute right-0 top-0 h-full flex items-center justify-center"
                      style={{
                        width: `${videoRatio}%`,
                        transition: 'width 0.7s ease-out',
                      }}
                    >
                      <span className="text-xs font-bold text-white pl-2">
                        {videoRatio.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: THEME.accentSubtle }}
                    />
                    <span style={{ color: THEME.accentSubtle }}>
                      风格生图 ({usageData.totalImageCount} 幅)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: THEME.textSubtle }}
                    />
                    <span style={{ color: THEME.textSubtle }}>
                      水墨动画 ({usageData.totalVideoCount} 幅)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usageData.typeBreakdown.map(
                  ({ type, label, count, color }) => (
                    <div
                      key={type}
                      className="p-4 rounded-xl shadow-md border flex items-center justify-between transition-transform"
                      style={{
                        backgroundColor: THEME.bgCard,
                        borderColor: `${THEME.accentSubtle}50`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: color }}
                        >
                          {type === 'image' ? (
                            <ImageIcon size={20} color={THEME.bgMain} />
                          ) : (
                            <Film size={20} color={THEME.bgMain} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div
                            className="text-sm font-semibold"
                            style={{ color: THEME.textDark }}
                          >
                            {label}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: THEME.textSubtle }}
                          >
                            累计作品
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-3xl font-extrabold"
                        style={{ color }}
                      >
                        {count}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div
              className="px-6 py-4 border-t text-right"
              style={{
                borderColor: `${THEME.accentSubtle}50`,
                backgroundColor: THEME.bgCard,
              }}
            >
              <button
                type="button"
                className="px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => setShowUsageModal(false)}
                style={{
                  backgroundColor: `${THEME.accentSubtle}30`,
                  color: THEME.textDark,
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StyleTransferPage;
