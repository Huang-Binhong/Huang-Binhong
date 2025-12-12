import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InteractiveMap.css';

// Import corner ornaments
import cornerTL from '../assets/corner-tl-ornate.svg';
import cornerTR from '../assets/corner-tr-ornate.svg';
import cornerBL from '../assets/corner-bl-ornate.svg';
import cornerBR from '../assets/corner-br-ornate.svg';

function InteractiveMap({ currentJourney, journeys, isPlaying, onLocationClick, mapStyle }) {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const brushMarkerRef = useRef(null);
    const markersRef = useRef([]);

    const ancientMapImage = 'ancient-map.jpg';
    const ancientMapOpacity = 0.3;

    // 调整后的地点位置，为了美观分布，避免遮挡
    const adjustedPositions = {
        0: [120.5, 28.5],   // 金华 - 右下
        1: [117.5, 29.0],   // 歙县 - 左下
        2: [122.5, 31.5],   // 上海 - 右中
        3: [116.0, 40.5],   // 北平 - 左上
        4: [120.5, 31.0]    // 杭州 - 中间
    };

    // 初始化地图
    useEffect(() => {
        if (!window.AMap || !mapContainer.current) return;

        const map = new window.AMap.Map(mapContainer.current, {
            center: [119.0, 33.5], // 调整中心点
            zoom: 5.5, // 适中的缩放级别
            mapStyle: 'amap://styles/normal',
            viewMode: '2D',
            features: ['bg', 'road', 'building', 'point'],
            showLabel: true,
            zooms: [3, 18],
            dragEnable: false,
            zoomEnable: false,
            scrollWheel: false,
            doubleClickZoom: false,
            keyboardEnable: false,
            touchZoom: false
        });
        mapInstance.current = map;

        map.on('complete', () => {
            console.log('地图加载完成，当前mapStyle:', mapStyle);
        });

        // 创建毛笔标记（精致SVG设计）
        const brushContent = document.createElement('div');
        brushContent.className = 'brush-marker';
        brushContent.innerHTML = `
      <div class="brush-container">
        <svg class="brush-svg" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- 渐变定义 -->
            <linearGradient id="brushHandle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#6B4423;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#8B5A2B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#6B4423;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="brushTip" cx="50%" cy="30%">
              <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#000000;stop-opacity:0.9" />
            </radialGradient>
          </defs>
          
          <!-- 笔杆装饰环 -->
          <ellipse cx="25" cy="8" rx="5" ry="1.5" fill="#D4A451" opacity="0.8"/>
          <ellipse cx="25" cy="15" rx="5" ry="1.5" fill="#D4A451" opacity="0.6"/>
          
          <!-- 笔杆主体 -->
          <rect x="20" y="0" width="10" height="55" fill="url(#brushHandle)" rx="3"/>
          <rect x="21" y="0" width="8" height="55" fill="#A0522D" rx="2" opacity="0.6"/>
          
          <!-- 笔杆高光 -->
          <rect x="21.5" y="5" width="2" height="45" fill="#D2B48C" rx="1" opacity="0.4"/>
          
          <!-- 笔头连接处 -->
          <ellipse cx="25" cy="55" rx="6" ry="3" fill="#3B4F3A" opacity="0.8"/>
          
          <!-- 笔头主体 - 上白下黑 -->
          <!-- 白色羊毫部分 -->
          <path d="M 19 55 Q 18 65, 19 75 Q 20 80, 22 83 L 25 85 L 28 83 Q 30 80, 31 75 Q 32 65, 31 55 Z" 
                fill="#F5F5F0" opacity="0.95"/>
          
          <!-- 白色羊毫纹理 -->
          <path d="M 21 60 Q 21 68, 22 76 Q 23 80, 24 83" 
                stroke="#E8E8E0" stroke-width="0.5" fill="none" opacity="0.6"/>
          <path d="M 23 60 Q 23 68, 24 76 Q 24.5 80, 25 85" 
                stroke="#E8E8E0" stroke-width="0.8" fill="none" opacity="0.7"/>
          <path d="M 27 60 Q 27 68, 26 76 Q 25.5 80, 25 85" 
                stroke="#E8E8E0" stroke-width="0.8" fill="none" opacity="0.7"/>
          <path d="M 29 60 Q 29 68, 28 76 Q 27 80, 26 83" 
                stroke="#E8E8E0" stroke-width="0.5" fill="none" opacity="0.6"/>
          
          <!-- 黑色笔尖部分 -->
          <path d="M 22 83 Q 20 86, 22 90 L 25 94 L 28 90 Q 30 86, 28 83 Z" 
                fill="url(#brushTip)" opacity="0.95"/>
          
          <!-- 黑色笔尖纹理 -->
          <path d="M 23 84 Q 23 88, 24 92" 
                stroke="#000" stroke-width="0.5" fill="none" opacity="0.5"/>
          <path d="M 25 84 Q 25 89, 25 94" 
                stroke="#1a1a1a" stroke-width="0.6" fill="none" opacity="0.6"/>
          <path d="M 27 84 Q 27 88, 26 92" 
                stroke="#000" stroke-width="0.5" fill="none" opacity="0.5"/>
          
          <!-- 笔尖墨迹 -->
          <ellipse cx="25" cy="94" rx="1.5" ry="3" fill="#000" opacity="0.8"/>
          
          <!-- 墨滴 -->
          <circle cx="25" cy="97" r="1.2" fill="#000" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div class="brush-shadow"></div>
      </div>
    `;

        const brushMarker = new window.AMap.Marker({
            content: brushContent,
            position: journeys[0].position,
            map: map,
            offset: new window.AMap.Pixel(-25, -75),
            zIndex: 1000,
            draggable: false
        });
        brushMarkerRef.current = brushMarker;

        return () => {
            if (brushMarker) brushMarker.setMap(null);
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
            if (map) map.destroy();
        };
    }, []);

    // 固定为古地图模式，不需要切换

    // 初始化时显示所有地点标记
    useEffect(() => {
        if (!mapInstance.current || journeys.length === 0) return;

        const map = mapInstance.current;

        // 清除旧的标记
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 为所有地点创建标记（包括金华），使用调整后的位置
        journeys.forEach((journey, index) => {
            const markerContent = document.createElement('div');
            markerContent.className = 'location-marker all-locations';
            markerContent.innerHTML = `
                <div class="marker-pin">
                    <div class="marker-icon" data-text="${journey.location.charAt(0)}"></div>
                </div>
                <div class="marker-label">${journey.location}</div>
            `;

            // 使用调整后的位置（如果存在）
            const displayPosition = adjustedPositions[index] || journey.position;

            const marker = new window.AMap.Marker({
                content: markerContent,
                position: displayPosition,
                map: map,
                offset: new window.AMap.Pixel(-25, -60),
                zIndex: 100,
                draggable: false
            });

            marker.on('click', () => {
                onLocationClick(journey);
            });

            markersRef.current.push(marker);
        });

        console.log('已创建所有地点标记，共', markersRef.current.length, '个');
    }, [journeys, onLocationClick]);

    // 当前游历变化
    useEffect(() => {
        if (!mapInstance.current || !brushMarkerRef.current || !journeys[currentJourney]) return;

        const journey = journeys[currentJourney];
        const map = mapInstance.current;

        // 如果有路径，毛笔沿路径动画移动
        if (journey.path && journey.path.length > 1) {
            animateBrushAlongPath(journey.path, 2000);
        } else {
            // 没有路径，直接定位毛笔
            brushMarkerRef.current.setPosition(journey.position);
        }

        // 不移动地图中心，保持能看到所有地点
        console.log('当前章节:', journey.title, '位置:', journey.location);

    }, [currentJourney, journeys]);

    // 沿路径动画移动毛笔
    const animateBrushAlongPath = (path, duration) => {
        if (!brushMarkerRef.current || path.length < 2) return;

        const startTime = Date.now();
        const totalPoints = path.length;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const segmentIndex = Math.floor(progress * (totalPoints - 1));
            const segmentProgress = (progress * (totalPoints - 1)) % 1;

            if (segmentIndex < totalPoints - 1) {
                const start = path[segmentIndex];
                const end = path[segmentIndex + 1];

                const currentLng = start[0] + (end[0] - start[0]) * segmentProgress;
                const currentLat = start[1] + (end[1] - start[1]) * segmentProgress;

                brushMarkerRef.current.setPosition([currentLng, currentLat]);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                brushMarkerRef.current.setPosition(path[path.length - 1]);
            }
        };

        animate();
    };



    // 添加单个位置标记
    const addLocationMarker = (journey) => {
        if (!mapInstance.current) return;

        const markerContent = document.createElement('div');
        markerContent.className = 'location-marker';
        markerContent.innerHTML = `
      <div class="marker-pin">
        <div class="marker-icon">${journey.location.charAt(0)}</div>
      </div>
      <div class="marker-label">${journey.location}</div>
    `;

        const marker = new window.AMap.Marker({
            content: markerContent,
            position: journey.position,
            map: mapInstance.current,
            offset: new window.AMap.Pixel(-20, -50),
            zIndex: 100,
            draggable: false
        });

        marker.on('click', () => {
            onLocationClick(journey);
        });

        markersRef.current.push(marker);
    };





    return (
        <div className="journey-interactive-map-wrapper">
            {/* 现代地图画布 - 作为底图 */}
            <div
                ref={mapContainer}
                className="journey-map-canvas"
            />

            {/* 古风地图背景 */}
            <div
                className="journey-ancient-map-background"
                style={{
                    backgroundImage: `url(/images/${ancientMapImage})`,
                    opacity: ancientMapOpacity
                }}
            ></div>



            {/* 古风装饰边角 */}
            <div className="journey-ancient-decorations">
                <div className="journey-corner-decoration top-left">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 5 5 L 5 95 M 5 5 L 95 5" stroke="#3B4F3A" strokeWidth="2" fill="none" opacity="0.6" />
                        <circle cx="5" cy="5" r="3" fill="#D4A451" opacity="0.8" />
                    </svg>
                </div>
                <div className="journey-corner-decoration top-right">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 95 5 L 5 5 M 95 5 L 95 95" stroke="#3B4F3A" strokeWidth="2" fill="none" opacity="0.6" />
                        <circle cx="95" cy="5" r="3" fill="#D4A451" opacity="0.8" />
                    </svg>
                </div>
                <div className="journey-corner-decoration bottom-left">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 5 95 L 5 5 M 5 95 L 95 95" stroke="#3B4F3A" strokeWidth="2" fill="none" opacity="0.6" />
                        <circle cx="5" cy="95" r="3" fill="#D4A451" opacity="0.8" />
                    </svg>
                </div>
                <div className="journey-corner-decoration bottom-right">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 95 95 L 5 95 M 95 95 L 95 5" stroke="#3B4F3A" strokeWidth="2" fill="none" opacity="0.6" />
                        <circle cx="95" cy="95" r="3" fill="#D4A451" opacity="0.8" />
                    </svg>
                </div>
            </div>

            <AnimatePresence>
                {journeys[currentJourney] && (
                    <motion.div
                        className="journey-indicator"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key={currentJourney}
                    >
                        <img src={cornerTL} className="ornament corner-tl" alt="" />
                        <img src={cornerTR} className="ornament corner-tr" alt="" />
                        <img src={cornerBL} className="ornament corner-bl" alt="" />
                        <img src={cornerBR} className="ornament corner-br" alt="" />
                        <div className="indicator-content">
                            <span className="indicator-year">{journeys[currentJourney].year}</span>
                            <span className="indicator-location">{journeys[currentJourney].location}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default InteractiveMap;
