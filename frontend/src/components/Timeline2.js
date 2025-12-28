// src/components/Timeline2/Timeline2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Tag, Image, Modal, Button, Tooltip } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    LeftOutlined,
    RightOutlined,
    SwapOutlined
} from '@ant-design/icons';
import './Timeline2.css';

const Timeline2 = ({ personalEvents = [], historicalEvents = [], loading }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0); // 当前显示的事件索引

    const timelineRef = useRef(null);

    // 固定时间范围 1865-1955
    const minYear = 1865;
    const maxYear = 1955;
    const totalYears = maxYear - minYear;

    // 每个年份的宽度（像素）
    const yearWidth = 160; // 稍微缩小一点

    // 按年份分组事件，并添加索引信息
    const getEventsByYear = (events, eventType) => {
        const eventsByYear = {};
        events.forEach(event => {
            if (!eventsByYear[event.year]) {
                eventsByYear[event.year] = {
                    events: [],
                    eventType: eventType // 标记是个人事件还是历史事件
                };
            }
            eventsByYear[event.year].events.push({
                ...event,
                yearIndex: eventsByYear[event.year].events.length // 添加在同年事件中的索引
            });
        });
        return eventsByYear;
    };

    const personalEventsByYear = getEventsByYear(personalEvents, 'personal');
    const historicalEventsByYear = getEventsByYear(historicalEvents, 'historical');

    // 处理事件点击 - 显示同年第一个事件
    const handleEventClick = (yearData, year, eventType) => {
        if (yearData && yearData.events.length > 0) {
            setSelectedEvent(yearData.events[0]); // 显示第一个事件
            setCurrentEventIndex(0); // 重置索引
            setModalVisible(true);
        }
    };

    // 在模态框中切换到下一个事件
    const handleNextEvent = () => {
        if (selectedEvent) {
            const year = selectedEvent.year;
            const eventType = personalEventsByYear[year] ? 'personal' : 'historical';
            const yearData = eventType === 'personal' ? personalEventsByYear[year] : historicalEventsByYear[year];

            if (yearData && yearData.events.length > 1) {
                const nextIndex = (currentEventIndex + 1) % yearData.events.length;
                setSelectedEvent(yearData.events[nextIndex]);
                setCurrentEventIndex(nextIndex);
            }
        }
    };

    // 在模态框中切换到上一个事件
    const handlePrevEvent = () => {
        if (selectedEvent) {
            const year = selectedEvent.year;
            const eventType = personalEventsByYear[year] ? 'personal' : 'historical';
            const yearData = eventType === 'personal' ? personalEventsByYear[year] : historicalEventsByYear[year];

            if (yearData && yearData.events.length > 1) {
                const prevIndex = (currentEventIndex - 1 + yearData.events.length) % yearData.events.length;
                setSelectedEvent(yearData.events[prevIndex]);
                setCurrentEventIndex(prevIndex);
            }
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            birth: '#8B0000',         // 深红
            education: '#2E8B57',     // 海绿
            work: '#8B4513',         // 鞍褐
            creation: '#3B4F3A',      // 墨绿
            award: '#D4A451',         // 金色
            death: '#696969',         // 暗灰
            travel: '#4682B4',        // 钢蓝
            collection: '#B8860B',    // 暗金
            publication: '#A52A2A',   // 棕色
            exhibition: '#CD853F',    // 秘鲁色
            political: '#8B0000',     // 深红
            military: '#B22222',      // 砖红
            diplomatic: '#8B4513',    // 鞍褐
            economic: '#DAA520',      // 金菊
            industrial: '#696969',    // 暗灰
            education_hist: '#2E8B57', // 海绿
            cultural: '#D2691E',      // 巧克力色
            social: '#CD853F'         // 秘鲁色
        };
        return colors[type] || '#8B7355'; // 默认用赭石色
    };

    const getTypeText = (type) => {
        const texts = {
            birth: '出生',
            education: '求学',
            work: '工作',
            creation: '创作',
            award: '荣誉',
            death: '逝世',
            travel: '游历',
            political: '政治',
            military: '军事',
            diplomatic: '外交',
            economic: '经济',
            industrial: '工业',
            education_hist: '教育',
            cultural: '文化',
            social: '社会'
        };
        return texts[type] || type;
    };

    const scrollLeft = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft -= 400;
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    const scrollRight = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft += 400;
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    const handleScroll = () => {
        if (timelineRef.current) {
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    // 获取同一年的事件数量显示标签
    const getEventCountTag = (yearData) => {
        if (yearData && yearData.events && yearData.events.length > 1) {
            return (
                <div className="event-count-badge">
                    <SwapOutlined style={{ fontSize: '10px' }} />
                    <span className="count-number">{yearData.events.length}</span>
                </div>
            );
        }
        return null;
    };

    // 获取事件卡片显示的标题（如果有多个事件，显示第一个）
    const getDisplayTitle = (yearData) => {
        if (!yearData || !yearData.events || yearData.events.length === 0) {
            return '';
        }
        return yearData.events[0].title;
    };

    if (loading) {
        return <div className="timeline-loading">⏳ 画轴徐徐展开中...</div>;
    }

    const hasEvents = personalEvents.length > 0 || historicalEvents.length > 0;
    if (!hasEvents) {
        return <div className="timeline-empty">📜 暂无记载</div>;
    }

    return (
        <div className="timeline2-container">
            {/* 顶部卷轴标题区域 */}
            <div className="timeline2-header">
                <div className="scroll-title-container">
                    <div className="scroll-title-left"></div>
                    <h1 className="scroll-title">黄宾虹生平与时代</h1>
                    <div className="scroll-title-right"></div>
                </div>
                <div className="scroll-subtitle">年谱画卷（1865-1955）</div>
            </div>

            {/* 时间轴主体 */}
            <div
                className="timeline-content"
                ref={timelineRef}
                onScroll={handleScroll}
            >
                <div
                    className="timeline-track"
                    style={{ width: `${(totalYears + 1) * yearWidth}px` }}
                >
                    {/* 双面尺子 */}
                    <div className="double-ruler">
                        {/* 时间轴标尺 - 显示所有年份 */}
                        <div className="timeline-ruler">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);
                                const isDecade = year % 10 === 0;

                                return (
                                    <div
                                        key={`tick-${year}`}
                                        className={`ruler-tick ${isDecade ? 'decade-tick' : ''}`}
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        {/* 刻度线 */}
                                        <div className="tick-line"></div>

                                        {/* 年份标签 */}
                                        <div className="year-tick-label">
                                            {year}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 尺子主体 - 古代卷尺样式 */}
                        <div className="ruler-body">
                            <div className="ruler-wood-grain"></div>
                            <div className="ruler-ink-line"></div>
                        </div>

                        {/* 上方：人物生平 */}
                        <div className="ruler-top">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const yearData = personalEventsByYear[year];
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                if (!yearData || yearData.events.length === 0) return null;

                                return (
                                    <div
                                        key={`personal-${year}`}
                                        className="event-year-container event-year-top"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        {/* 连接线 - 朱砂色 */}
                                        <div className="year-connector personal-connector"></div>

                                        {/* 事件卡片 */}
                                        <div
                                            className="event-card-top"
                                            onClick={() => handleEventClick(yearData, year, 'personal')}
                                        >
                                            {getEventCountTag(yearData)}
                                            <div className="event-card-content">
                                                <div className="event-title">
                                                    {getDisplayTitle(yearData)}
                                                </div>
                                                <div className="event-type">
                                                    <Tag
                                                        color={getTypeColor(yearData.events[0].type)}
                                                        size="small"
                                                        className="type-tag"
                                                    >
                                                        {getTypeText(yearData.events[0].type)}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 下方：历史事件 */}
                        <div className="ruler-bottom">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const yearData = historicalEventsByYear[year];
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                if (!yearData || yearData.events.length === 0) return null;

                                return (
                                    <div
                                        key={`historical-${year}`}
                                        className="event-year-container event-year-bottom"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        {/* 连接线 - 墨色 */}
                                        <div className="year-connector historical-connector"></div>

                                        {/* 事件卡片 */}
                                        <div
                                            className="event-card-bottom"
                                            onClick={() => handleEventClick(yearData, year, 'historical')}
                                        >
                                            {getEventCountTag(yearData)}
                                            <div className="event-card-content">
                                                <div className="event-title">
                                                    {getDisplayTitle(yearData)}
                                                </div>
                                                <div className="event-type">
                                                    <Tag
                                                        color={getTypeColor(yearData.events[0].type)}
                                                        size="small"
                                                        className="type-tag"
                                                    >
                                                        {getTypeText(yearData.events[0].type)}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 事件详情模态框 */}
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
                className="event-detail-modal"
                title={
                    selectedEvent && (
                        <div className="modal-title-container">
                            <div className="modal-title-content">
                                <span>{selectedEvent.title}</span>
                                {selectedEvent && (() => {
                                    const year = selectedEvent.year;
                                    const eventType = personalEventsByYear[year] ? 'personal' : 'historical';
                                    const yearData = eventType === 'personal' ? personalEventsByYear[year] : historicalEventsByYear[year];
                                    const eventCount = yearData ? yearData.events.length : 0;

                                    if (eventCount > 1) {
                                        return (
                                            <div className="event-switcher">
                                                <Button
                                                    size="small"
                                                    icon={<LeftOutlined />}
                                                    onClick={handlePrevEvent}
                                                    disabled={eventCount <= 1}
                                                />
                                                <span className="event-counter">
                                                    {currentEventIndex + 1} / {eventCount}
                                                </span>
                                                <Button
                                                    size="small"
                                                    icon={<RightOutlined />}
                                                    onClick={handleNextEvent}
                                                    disabled={eventCount <= 1}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    )
                }
            >
                {selectedEvent && (
                    <div className="event-detail">
                        <div className="event-meta">
                            <Tag color={getTypeColor(selectedEvent.type)} className="detail-type-tag">
                                {getTypeText(selectedEvent.type)}
                            </Tag>
                            <span className="meta-item"><CalendarOutlined /> {selectedEvent.year}年</span>
                            {selectedEvent.location && (
                                <span className="meta-item"><EnvironmentOutlined /> {selectedEvent.location}</span>
                            )}
                        </div>

                        <div className="event-description">
                            <h4>📖 概述</h4>
                            <p>{selectedEvent.description}</p>
                        </div>

                        {selectedEvent.detailedContent && (
                            <div className="event-content">
                                <h4>📝 详细记载</h4>
                                <div className="content-text">{selectedEvent.detailedContent}</div>
                            </div>
                        )}

                        {selectedEvent.images && selectedEvent.images.length > 0 && (
                            <div className="event-images">
                                <h4>🖼️ 相关图鉴</h4>
                                <Image.PreviewGroup>
                                    <div className="image-grid">
                                        {selectedEvent.images.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="event-image"
                                                    width={180}
                                                    height={120}
                                                />
                                                <div className="image-caption">{image.alt}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Image.PreviewGroup>
                            </div>
                        )}

                        {selectedEvent.relatedWorks && selectedEvent.relatedWorks.length > 0 && (
                            <div className="related-works">
                                <h4>📚 相关著作</h4>
                                <ul className="works-list">
                                    {selectedEvent.relatedWorks.map((work, index) => (
                                        <li key={index} className="work-item">
                                            <span className="work-title">{work.title}</span>
                                            {work.year && <span className="work-year">（{work.year}）</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Timeline2;