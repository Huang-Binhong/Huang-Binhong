// components/Timeline/AdvancedWave.jsx
import React, { useRef, useEffect, useMemo, useState } from 'react';

const AdvancedWave = ({
                          events = [],
                          selectedIndex = 0,
                          onNodeClick,
                          width = 1200,
                          height = 140  // 增加高度给标签更多空间
                      }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const timeRef = useRef(0);
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(selectedIndex);

    // 波浪状态管理
    const waveStateRef = useRef({
        focusPosition: 0,
        travelingWaves: [],
        hasActiveWave: false,
    });

    const colors = {
        primary: {
            black: '#2E2E2E',
            green: '#3B4F3A',
            cream: '#F7F5F0',
            gold: '#D4A451'
        }
    };

    const sortedEvents = useMemo(() => {
        return events && events.length > 0 ? [...events].sort((a, b) => a.year - b.year) : [];
    }, [events]);
    // 初始化焦点
    useEffect(() => {
        if (sortedEvents.length > 0) {
            const margin = 80;
            const availableWidth = width - margin * 2;
            waveStateRef.current.focusPosition = margin + (selectedIndex / (sortedEvents.length - 1)) * availableWidth;
        }
    }, [sortedEvents, selectedIndex, width]);

    useEffect(() => {
        if (sortedEvents.length === 0) return;

        if (selectedIndex !== currentSelectedIndex) {
            const margin = 80;
            const availableWidth = width - margin * 2;
            const fromX = margin + (currentSelectedIndex / (sortedEvents.length - 1)) * availableWidth;
            const toX = margin + (selectedIndex / (sortedEvents.length - 1)) * availableWidth;

            // 创建传播波浪
            const newWave = {
                id: Date.now(),
                startX: fromX,
                targetX: toX,
                currentX: fromX,
                progress: 0,
                distance: Math.abs(toX - fromX),
                direction: toX > fromX ? 1 : -1
            };

            waveStateRef.current.travelingWaves.push(newWave);
            waveStateRef.current.hasActiveWave = true;
            setCurrentSelectedIndex(selectedIndex);
        }
    }, [selectedIndex, currentSelectedIndex, sortedEvents, width]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || sortedEvents.length === 0) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // 基础海洋波浪
        const getBaseWaveHeight = (x, time) => {
            return (
                Math.sin(x * 0.004 + time * 0.3) * 2.5 +
                Math.sin(x * 0.008 + time * 0.5) * 1.8 +
                Math.cos(x * 0.003 + time * 0.2) * 1.2 +
                Math.sin(x * 0.015 + time * 0.7) * 0.8
            );
        };

        // 计算节点位置
        const getNodeX = (index) => {
            const margin = 80; // 左右边距
            const availableWidth = width - margin * 2; // 可用宽度
            return margin + (index / (sortedEvents.length - 1)) * availableWidth;
        };


        // 更新波浪状态
        const updateWaveState = (time) => {
            const { travelingWaves } = waveStateRef.current;

            for (let i = travelingWaves.length - 1; i >= 0; i--) {
                const wave = travelingWaves[i];

                wave.progress += 0.008;
                wave.currentX = wave.startX + wave.distance * wave.progress * wave.direction;

                if (wave.progress >= 1) {
                    waveStateRef.current.focusPosition = wave.targetX;
                    travelingWaves.splice(i, 1);

                    if (travelingWaves.length === 0) {
                        waveStateRef.current.hasActiveWave = false;
                    }
                }
            }
        };

        // 焦点波浪效果
        const getFocusWaveHeight = (x, time) => {
            const { focusPosition, travelingWaves, hasActiveWave } = waveStateRef.current;
            let height = 0;

            // 静态焦点波浪
            const distanceToFocus = Math.abs(x - focusPosition);
            if (distanceToFocus < 120 && !hasActiveWave) {
                const influence = Math.exp(-(distanceToFocus * distanceToFocus) / 2000);
                const baseHeight = 25;
                const dynamic = Math.sin(time * 1.5) * 1.5;
                height += (baseHeight + dynamic) * influence;
            }

            // 传播中的波浪
            travelingWaves.forEach(wave => {
                const distanceToWave = Math.abs(x - wave.currentX);
                if (distanceToWave < 80) {
                    const waveShape = Math.exp(-(distanceToWave * distanceToWave) / 1200);
                    const waveHeight = 18 * (1 - Math.abs(wave.progress - 0.5) * 1.2);
                    const dynamic = Math.sin(distanceToWave * 0.08 - time * 2.5) * 2;
                    height += (waveHeight + dynamic) * waveShape;
                }

                // 源位置回落
                if (wave.progress > 0.2) {
                    const distanceToSource = Math.abs(x - wave.startX);
                    if (distanceToSource < 60) {
                        const sourceInfluence = Math.exp(-(distanceToSource * distanceToSource) / 800);
                        const sourceDecay = (1 - wave.progress) * 0.5;
                        height += 8 * sourceInfluence * sourceDecay;
                    }
                }
            });

            return height;
        };

        // 完整的波浪高度
        const getTotalWaveHeight = (x, time) => {
            const baseWave = getBaseWaveHeight(x, time);
            const focusWave = getFocusWaveHeight(x, time);
            return baseWave + focusWave;
        };

        // 获取节点精确的Y坐标（基于波浪高度）
        const getNodeY = (nodeX, time) => {
            return height / 2 - getTotalWaveHeight(nodeX, time);
        };

        const drawWave = () => {
            const currentTime = timeRef.current;

            updateWaveState(currentTime);

            ctx.clearRect(0, 0, width, height);

            // 背景
            ctx.fillStyle = colors.primary.cream;
            ctx.fillRect(0, 0, width, height);

            const segmentCount = 400;
            const segmentWidth = width / segmentCount;

            // 绘制波浪填充
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, height / 2);

            // 绘制平滑的波浪线
            for (let i = 0; i <= segmentCount; i++) {
                const x = i * segmentWidth;
                const y = getNodeY(x, currentTime);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();

            // 渐变填充
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(59, 79, 58, 0.5)');
            gradient.addColorStop(0.5, 'rgba(75, 95, 74, 0.5)');
            gradient.addColorStop(1, 'rgba(83, 103, 82, 0.5)');

            ctx.fillStyle = gradient;
            ctx.fill();

            // 平滑的轮廓线
            ctx.beginPath();
            for (let i = 0; i <= segmentCount; i++) {
                const x = i * segmentWidth;
                const y = getNodeY(x, currentTime);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = 'rgba(247, 245, 240, 0.6)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // 绘制所有节点 - 确保节点位置与波浪高度一致
            sortedEvents.forEach((event, index) => {
                const nodeX = getNodeX(index);
                const nodeY = getNodeY(nodeX, currentTime); // 使用相同的函数计算节点Y坐标

                // 节点连接线 - 从节点延伸到海平面下方
                ctx.beginPath();
                ctx.moveTo(nodeX, nodeY);
                ctx.lineTo(nodeX, height / 2 + 15); // 延长连接线
                ctx.strokeStyle = 'rgba(59, 79, 58, 0.3)';
                ctx.lineWidth = 0.8;
                ctx.setLineDash([2, 3]);
                ctx.stroke();
                ctx.setLineDash([]);

                // 节点圆点 - 确保在波浪表面上
                ctx.beginPath();
                ctx.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 79, 58, 0.6)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(247, 245, 240, 0.8)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // 当前焦点位置的节点光晕
                const { hasActiveWave, focusPosition } = waveStateRef.current;
                const isAtFocus = Math.abs(nodeX - focusPosition) < 5 && !hasActiveWave;
                if (isAtFocus) {
                    ctx.beginPath();
                    ctx.arc(nodeX, nodeY, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(212, 164, 81, 0.4)';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }

                // 年份标签 - 放大字体，更清晰
                ctx.fillStyle = colors.primary.black;
                ctx.font = 'bold 13px "Source Han Sans", "PingFang SC", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(event.year.toString(), nodeX, height / 2 + 18);

                // 标题标签 - 放大字体，完整显示
                ctx.fillStyle = colors.primary.green;
                ctx.font = '12px "Source Han Sans", "PingFang SC", sans-serif';
                // 根据可用空间调整标题显示
                const availableWidth = 100; // 为每个标题分配更多空间
                let displayTitle = event.title;

                // 如果标题太长，适当截断但显示更多字符
                if (ctx.measureText(displayTitle).width > availableWidth) {
                    // 尝试显示更多字符
                    for (let i = event.title.length - 1; i > 6; i--) {
                        displayTitle = event.title.substring(0, i) + '...';
                        if (ctx.measureText(displayTitle).width <= availableWidth) {
                            break;
                        }
                    }
                }

                ctx.fillText(displayTitle, nodeX, height / 2 + 32);
            });

            // 绘制传播波浪的指示
            waveStateRef.current.travelingWaves.forEach(wave => {
                const waveX = wave.currentX;
                const waveY = getNodeY(waveX, currentTime); // 使用相同的函数计算波浪指示器位置

                ctx.beginPath();
                ctx.arc(waveX, waveY, 6, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(212, 164, 81, 0.3)';
                ctx.lineWidth = 1.2;
                ctx.stroke();
            });

            timeRef.current += 0.02;
        };

        const animate = () => {
            drawWave();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [sortedEvents, currentSelectedIndex, width, height, colors]);

    // 修改点击处理函数，考虑边距
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        let minDistance = Infinity;
        let closestIndex = -1;

        sortedEvents.forEach((event, index) => {
            const margin = 80;
            const availableWidth = width - margin * 2;
            const nodeX = margin + (index / (sortedEvents.length - 1)) * availableWidth;
            const distance = Math.abs(x - nodeX);

            if (distance < minDistance && distance < 25) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== -1 && onNodeClick) {
            onNodeClick(sortedEvents[closestIndex], closestIndex);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
                cursor: 'pointer',
                display: 'block',
                borderRadius: '4px',
                background: colors.primary.cream,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: `1px solid rgba(59, 79, 58, 0.08)`
            }}
        />
    );
};

export default AdvancedWave;