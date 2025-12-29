// src/components/Timeline2/Timeline2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Tag, Image, Modal, Button } from 'antd';
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
    const [selectedYearEvents, setSelectedYearEvents] = useState([]);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const timelineRef = useRef(null);

    // 固定时间范围 1865-1955
    const minYear = 1865;
    const maxYear = 1955;
    const totalYears = maxYear - minYear;

    // 每个年份的宽度（像素）
    const yearWidth = 160;

    // 按年份分组事件，每个年份只取一个事件显示
    const getEventsByYear = (events) => {
        const eventsByYear = {};
        events.forEach(event => {
            if (!eventsByYear[event.year]) {
                eventsByYear[event.year] = [];
            }
            eventsByYear[event.year].push(event);
        });
        return eventsByYear;
    };

    const personalEventsByYear = getEventsByYear(personalEvents);
    const historicalEventsByYear = getEventsByYear(historicalEvents);

    // 处理事件点击
    const handleEventClick = (event, allEvents, eventType) => {
        setSelectedEvent(event);
        setSelectedYearEvents(allEvents);
        setCurrentEventIndex(allEvents.findIndex(e => e.id === event.id));
        setModalVisible(true);
    };

    // 模态框中切换事件
    const handleSwitchEvent = (direction) => {
        if (!selectedYearEvents || selectedYearEvents.length <= 1) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentEventIndex + 1) % selectedYearEvents.length;
        } else {
            newIndex = (currentEventIndex - 1 + selectedYearEvents.length) % selectedYearEvents.length;
        }

        setCurrentEventIndex(newIndex);
        setSelectedEvent(selectedYearEvents[newIndex]);
    };

    // 样式相关函数
    const getTypeColor = (type) => {
        const colors = {
            birth: '#8B0000',
            education: '#2E8B57',
            work: '#8B4513',
            creation: '#3B4F3A',
            award: '#D4A451',
            death: '#696969',
            travel: '#4682B4',
            collection: '#B8860B',
            publication: '#A52A2A',
            exhibition: '#CD853F',
            political: '#8B0000',
            military: '#B22222',
            diplomatic: '#8B4513',
            economic: '#DAA520',
            industrial: '#696969',
            education_hist: '#2E8B57',
            cultural: '#D2691E',
            social: '#CD853F'
        };
        return colors[type] || '#8B7355';
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
            social: '社会',
            recommendation:'推荐',
            other:'其他'
        };
        return texts[type] || type;
    };

    // 滚轮控制
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
                        {/* 时间轴标尺 */}
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
                                        <div className="tick-line"></div>
                                        <div className="year-tick-label">
                                            {year}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="ruler-body">
                            <div className="ruler-wood-grain"></div>
                            <div className="ruler-ink-line"></div>
                        </div>

                        {/* 上方：人物生平 */}
                        <div className="ruler-top">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const yearEvents = personalEventsByYear[year];
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                if (!yearEvents) return null;

                                const firstEvent = yearEvents[0];
                                const hasMultipleEvents = yearEvents.length > 1;

                                return (
                                    <div
                                        key={`personal-${year}`}
                                        className="event-year-container event-year-top"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        <div className="year-connector personal-connector"></div>

                                        <div
                                            className="event-card-top"
                                            onClick={() => handleEventClick(firstEvent, yearEvents, 'personal')}
                                        >
                                            <div className="event-card-content">
                                                <div className="event-title">
                                                    {firstEvent.title}
                                                    {hasMultipleEvents && (
                                                        <span className="event-count-badge">
                                                            +{yearEvents.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="event-type">
                                                    <Tag
                                                        color={getTypeColor(firstEvent.type)}
                                                        size="small"
                                                        className="type-tag"
                                                    >
                                                        {getTypeText(firstEvent.type)}
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
                                const yearEvents = historicalEventsByYear[year];
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                if (!yearEvents) return null;

                                const firstEvent = yearEvents[0];
                                const hasMultipleEvents = yearEvents.length > 1;

                                return (
                                    <div
                                        key={`historical-${year}`}
                                        className="event-year-container event-year-bottom"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        <div className="year-connector historical-connector"></div>

                                        <div
                                            className="event-card-bottom"
                                            onClick={() => handleEventClick(firstEvent, yearEvents, 'historical')}
                                        >
                                            <div className="event-card-content">
                                                <div className="event-title">
                                                    {firstEvent.title}
                                                    {hasMultipleEvents && (
                                                        <span className="event-count-badge">
                                                            +{yearEvents.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="event-type">
                                                    <Tag
                                                        color={getTypeColor(firstEvent.type)}
                                                        size="small"
                                                        className="type-tag"
                                                    >
                                                        {getTypeText(firstEvent.type)}
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
                title={selectedEvent?.title}
            >
                {selectedEvent && (
                    <div className="event-detail">
                        <div className="event-meta">
                            <div className="meta-left">
                                <Tag color={getTypeColor(selectedEvent.type)} className="detail-type-tag">
                                    {getTypeText(selectedEvent.type)}
                                </Tag>
                                <span className="meta-item">
                                    <CalendarOutlined /> {selectedEvent.year}年
                                </span>
                                {selectedEvent.location && (
                                    <span className="meta-item">
                                        <EnvironmentOutlined /> {selectedEvent.location}
                                    </span>
                                )}
                            </div>
                            {selectedYearEvents && selectedYearEvents.length > 1 && (
                                <div className="event-switcher">
                                    <Button
                                        icon={<LeftOutlined />}
                                        size="small"
                                        onClick={() => handleSwitchEvent('prev')}
                                        disabled={selectedYearEvents.length <= 1}
                                    />
                                    <span className="event-counter">
                                        {currentEventIndex + 1} / {selectedYearEvents.length}
                                    </span>
                                    <Button
                                        icon={<RightOutlined />}
                                        size="small"
                                        onClick={() => handleSwitchEvent('next')}
                                        disabled={selectedYearEvents.length <= 1}
                                    />
                                </div>
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