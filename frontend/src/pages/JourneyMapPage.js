import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from '../components/Timeline';
import InteractiveMap from '../components/InteractiveMap';
import StoryPanel from '../components/StoryPanel';
import InkParticles from '../components/InkParticles';
import FlyingBird from '../components/FlyingBird';
import audioManager from '../utils/audioManager';
import './JourneyMapPage.css';

function JourneyMapPage() {
  const [currentJourney, setCurrentJourney] = useState(0);
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const prevJourneyRef = useRef(0);

  const journeys = [
    {
      id: 0,
      title: '序章',
      year: '1865年',
      location: '金华',
      position: [119.6455, 29.1121],
      description: '黄宾虹出生于浙江金华,自幼受家学熏陶,开始接触书画艺术。',
      // artworks: [
      //   {
      //     title: '启蒙时期习作',
      //     image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      //     description: '幼年时期的书法练习'
      //   }
      // ],
      people: ['父亲黄定华'],
      path: []
    },
    {
      id: 1,
      title: '第一次游历',
      year: '1886-1899年',
      location: '歙县',
      position: [118.4479, 29.8147],
      description: '回归祖籍徽州歙县潭渡村,深入研习新安画派,奠定艺术根基。',
      artworks: [
        {
          title: '新安江图',
          image: '/images/Xinan.jpg',
          description: '描绘徽州山水的早期代表作'
        },
        {
          title: '黄山写生册',
          image: 'images/Huangshan.jpg',
          description: '黄山实地写生作品集'
        }
      ],
      people: ['汪宗沂', '许承尧'],
      path: [
        [119.6455, 29.1121],
        [119.0, 29.5],
        [118.4479, 29.8147]
      ]
    },
    {
      id: 2,
      title: '第二次游历',
      year: '1907-1937年',
      location: '上海',
      position: [121.4737, 31.2304],
      description: '赴沪发展,寓居上海三十载,艺术创作进入黄金时期,与众多文人雅士交游。',
      artworks: [
        {
          title: '秋山萧树',
          image: 'images/Qiushan.jpg',
          description: '描绘上海风貌'
        },
      ],
      people: ['黄炎培', '曾熙', '李瑞清'],
      path: [
        [118.4479, 29.8147],
        [119.5, 30.5],
        [120.8, 31.0],
        [121.4737, 31.2304]
      ]
    },
    {
      id: 3,
      title: '第三次游历',
      year: '1937-1948年',
      location: '北平',
      position: [116.4074, 39.9042],
      description: '抗战期间北上,在北平与徐悲鸿、齐白石等大师交流,艺术风格更趋成熟。',
      artworks: [
        {
          title: '山水长卷',
          image: 'images/Beiping.jpg',
          description: '气势磅礴的长卷巨制'
        },
        {
          title: '黄山松涛',
          image: 'images/BeipingHuangshan.jpg',
          description: '描绘黄山松树的力作'
        }
      ],
      people: ['徐悲鸿', '齐白石', '李可染'],
      path: [
        [121.4737, 31.2304],
        [120.0, 33.0],
        [118.0, 36.0],
        [116.4074, 39.9042]
      ]
    },
    {
      id: 4,
      title: '终章',
      year: '1948-1955年',
      location: '杭州',
      position: [120.1551, 30.2741],
      description: '晚年定居杭州栖霞岭,继续创作,直至终老。',
      artworks: [
        {
          title: '西泠湖山图',
          image: 'images/Xihu.jpg',
          description: '晚年西湖题材代表作'
        },
        {
          title: '西湖皋亭',
          image: 'images/Xihu2.jpg',
          description: '晚年西湖题材代表作'
        }
      ],
      people: ['吴昌硕', '潘天寿'],
      path: [
        [116.4074, 39.9042],
        [117.0, 36.0],
        [119.0, 32.0],
        [120.1551, 30.2741]
      ]
    }
  ];

  // 为每个journey创建独立的IntersectionObserver引用
  const sectionRefs = journeys.map(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { ref, inView } = useInView({
      threshold: 0.5,
      triggerOnce: false
    });
    return { ref, inView };
  });

  // 音频初始化
  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioManager.preloadAll();
        setAudioReady(true);
      } catch (error) {
        console.warn('音频预加载失败', error);
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      // 组件卸载时停止音频
      audioManager.stopAll();
    };
  }, []);

  // 根据滚动位置自动切换当前journey
  useEffect(() => {
    sectionRefs.forEach((section, index) => {
      if (section.inView) {
        setCurrentJourney(index);
        setIsPlaying(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRefs.map(s => s.inView).join(',')]);

  // 根据当前journey切换背景音乐
  useEffect(() => {
    if (!audioReady) return;

    if (currentJourney === 0) {
      audioManager.play('water');
    } else if (currentJourney === 1 || currentJourney === 2) {
      audioManager.play('wind');
    } else if (currentJourney === 3 || currentJourney === 4) {
      audioManager.play('guqin');
    }
  }, [currentJourney, audioReady]);

  // 滚动指示器控制
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 当切换到不同时期时，自动关闭故事面板
  useEffect(() => {
    // 只有当真正切换到不同的 journey 时才关闭面板
    if (prevJourneyRef.current !== currentJourney) {
      console.log('Journey changed from', prevJourneyRef.current, 'to', currentJourney, 'closing panel');
      setShowStoryPanel(false);
      setSelectedLocation(null);
      prevJourneyRef.current = currentJourney;
    }
  }, [currentJourney]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowStoryPanel(true);
  };

  const handleAudioToggle = (e) => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);

    // 触发水墨效果
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.dispatchEvent(new CustomEvent('inkEffect', {
      detail: { x, y, color: '#D4A451' }
    }));
  };

  return (
    <div className="journey-map-page">
      {showScrollIndicator && <FlyingBird />}
      <InkParticles />

      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>

      {/* 静音按钮 - 左下角 */}
      {/* 左下角返回首页按钮 */}
      <Link to="/" className="a_back_left">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      {/* 静音按钮 */}
      <button
        className="a_mute"
        onClick={(e) => handleAudioToggle(e)}
        title={audioReady ? (isMuted ? '开启音效' : '关闭音效') : '音效加载中...'}
      >
        <img src={isMuted ? "/images/mute.svg" : "/images/unmute.svg"} alt={isMuted ? "静音" : "取消静音"} />
      </button>

      {/* 固定的地图容器 */}
      <div className="journey-map-container">
        <InteractiveMap
          currentJourney={currentJourney}
          journeys={journeys}
          isPlaying={isPlaying}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* 滚动的时间线容器 */}
      <div className="journey-timeline-container">
        <div className="journey-timeline-header">
          <h1 className="journey-main-title">黄宾虹先生游历纪</h1>
          <p className="journey-subtitle">一代宗师的艺术行旅</p>

          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                className="journey-scroll-indicator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <span className="journey-scroll-text">向下滚动开始旅程</span>
                <div className="journey-scroll-arrow"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 遍历每个journey渲染Timeline */}
        {journeys.map((journey, index) => (
          <div
            key={journey.id}
            ref={sectionRefs[index].ref}
            className={`journey-section ${sectionRefs[index].inView ? 'active' : ''}`}
          >
            <Timeline
              journey={journey}
              isActive={currentJourney === index}
              index={index}
            />
          </div>
        ))}

        <div className="journey-timeline-footer">
          <p className="journey-footer-text">— 终 —</p>
        </div>
      </div>

      {/* 故事面板 */}
      <AnimatePresence mode="wait">
        {showStoryPanel && selectedLocation && (
          <StoryPanel
            key={selectedLocation.id}
            journey={selectedLocation}
            onClose={() => {
              console.log('Panel close button clicked');
              setShowStoryPanel(false);
              setSelectedLocation(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default JourneyMapPage;
