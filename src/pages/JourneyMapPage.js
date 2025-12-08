import React, { useState, useEffect } from 'react';
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

  const journeys = [
    {
      id: 0,
      title: '序章',
      year: '1865年',
      location: '金华',
      position: [119.6455, 29.1121],
      description: '黄宾虹出生于浙江金华，自幼受家学熏陶，开始接触书画艺术。',
      artworks: [
        {
          title: '启蒙时期习作',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
          description: '幼年时期的书法练习'
        }
      ],
      people: ['父亲黄定华'],
      path: []
    },
    {
      id: 1,
      title: '第一次游历',
      year: '1886-1899年',
      location: '歙县',
      position: [118.4479, 29.8147],
      description: '回归祖籍徽州歙县潭渡村，深入研习新安画派，奠定艺术根基。',
      artworks: [
        {
          title: '新安江图',
          image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800',
          description: '描绘徽州山水的早期代表作'
        },
        {
          title: '黄山写生册',
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
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
      description: '赴沪发展，寓居上海三十载，艺术创作进入黄金时期，与众多文人雅士交游。',
      artworks: [
        {
          title: '沪上胜景图',
          image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800',
          description: '描绘上海城市风貌'
        }
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
      description: '抗战期间北上，在北平与徐悲鸿、齐白石等大师交流，艺术风格更趋成熟。',
      artworks: [
        {
          title: '北京山水',
          image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
          description: '北京时期山水画'
        }
      ],
      people: ['徐悲鸿', '齐白石'],
      path: [
        [121.4737, 31.2304],
        [119.0, 35.0],
        [116.4074, 39.9042]
      ]
    },
    {
      id: 4,
      title: '晚年归乡',
      year: '1948-1955年',
      location: '杭州',
      position: [120.1551, 30.2741],
      description: '晚年定居杭州，潜心创作，形成独特的"黑密厚重、黑里透亮"画风。',
      artworks: [
        {
          title: '西湖山水',
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
          description: '晚年杰作，笔墨浑厚'
        }
      ],
      people: ['潘天寿', '傅雷'],
      path: [
        [116.4074, 39.9042],
        [118.0, 34.0],
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleLocationClick = (journey) => {
    setSelectedLocation(journey);
    setShowStoryPanel(true);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
      audioManager.pause();
    } else {
      audioManager.play();
    }
  };

  return (
    <div className="journey-map-page">
      <InkParticles />
      <FlyingBird />

      <div className="nav_logo">
        <img src="/images/list_logo.png" alt="" />
      </div>
      <div className="nav_logo2">
        <img src="/images/list_logo2.png" alt="" />
      </div>

      <Link to="/" className="a_home">
        <img src="/images/a_home.png" alt="返回首页" />
      </Link>

      <div className="journey_content">
        {/* 时间线容器 */}
        <div className="timeline-container">
          <div className="timeline-header">
            <motion.h1 
              className="main-title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              黄宾虹先生游历纪
            </motion.h1>
            <motion.p 
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              一代宗师的艺术行旅
            </motion.p>

            <AnimatePresence>
              {showScrollIndicator && (
                <motion.div
                  className="scroll-indicator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <span className="scroll-text">向下滚动开始旅程</span>
                  <div className="scroll-arrow"></div>
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

          <div className="timeline-footer">
            <p className="footer-text">— 终 —</p>
          </div>
        </div>

        {/* 交互式地图 */}
        <InteractiveMap 
          journeys={journeys}
          currentJourney={currentJourney}
          onLocationClick={handleLocationClick}
        />

        <AnimatePresence>
          {showStoryPanel && selectedLocation && (
            <StoryPanel 
              journey={selectedLocation}
              onClose={() => setShowStoryPanel(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default JourneyMapPage;
