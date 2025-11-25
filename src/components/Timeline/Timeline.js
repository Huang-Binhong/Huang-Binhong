// src/components/Timeline/Timeline.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, Tag, Image, Modal, Button, Tooltip } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    LeftOutlined,
    RightOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { getHistoricalEventColor, getHistoricalEventText } from '../../services/bioDataService';
import './Timeline.css';

const Timeline = ({ events, loading }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const timelineRef = useRef(null);

    // 计算时间跨度
    const getTimelineRange = () => {
        if (!events || events.length === 0) return { min: 0, max: 0 };
        const years = events.map(event => event.year);
        return {
            min: Math.min(...years),
            max: Math.max(...years)
        };
    };

    // 按年份分组事件
    const getEventsByYear = () => {
        const eventsByYear = {};
        events.forEach(event => {
            if (!eventsByYear[event.year]) {
                eventsByYear[event.year] = [];
            }
            eventsByYear[event.year].push(event);
        });
        return eventsByYear;
    };

    const { min, max } = getTimelineRange();
    const totalYears = max - min;
    const eventsByYear = getEventsByYear();

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const getTypeColor = (type) => {
        const colors = {
            birth: '#2E2E2E',
            education: '#556B2F',
            work: '#8B4513',           // 深棕色 - 工作
            creation: '#3B4F3A',       // 墨绿色 - 创作
            award: '#D4A451',          // 金黄色 - 荣誉
            death: '#696969',          // 深灰色 - 逝世
            travel: '#2E8B57',         // 海绿色 - 游历
            collection: '#B8860B',     // 暗金色 - 收藏
            publication: '#A52A2A',    // 红棕色 - 出版
            exhibition: '#CD853F'      // 秘鲁色 - 展览
        };
        return colors[type] || '#d9d9d9';
    };

    const getTypeText = (type) => {
        const texts = {
            birth: '出生',
            education: '求学',
            work: '工作',
            creation: '创作',
            award: '荣誉',
            death: '逝世',
            travel: '游历'
        };
        return texts[type] || type;
    };

    const scrollLeft = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft -= 200;
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    const scrollRight = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft += 200;
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    const handleScroll = () => {
        if (timelineRef.current) {
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    if (loading) {
        return <div className="timeline-loading">加载中...</div>;
    }

    if (!events || events.length === 0) {
        return <div className="timeline-empty">暂无数据</div>;
    }

    return (
        <div className="timeline-container">
            {/* 导航按钮 */}
            <div className="timeline-nav">
                <Button
                    icon={<LeftOutlined />}
                    onClick={scrollLeft}
                    className="nav-btn"
                    disabled={scrollPosition <= 0}
                    size="small"
                />
                <Button
                    icon={<RightOutlined />}
                    onClick={scrollRight}
                    className="nav-btn"
                    size="small"
                />
            </div>

            {/* 时间轴主体 */}
            <div
                className="timeline-content"
                ref={timelineRef}
                onScroll={handleScroll}
            >
                <div
                    className="timeline-track"
                    style={{ width: `${totalYears * 60 + 200}px` }}
                >
                    {/* 双面尺子 */}
                    <div className="double-ruler">
                        {/* 上方年份和标题 */}
                        <div className="ruler-top">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = min + i;
                                const yearEvents = eventsByYear[year];
                                const isTopYear = i % 2 === 0; // 偶数年份在上方

                                if (!isTopYear || !yearEvents) return null;

                                return (
                                    <div
                                        key={`top-${year}`}
                                        className="ruler-year-top"
                                        style={{ left: `${(i / totalYears) * 100}%` }}
                                    >
                                        {/* 上方年份标签 */}
                                        <div
                                            className="year-label-top"
                                            onClick={() => yearEvents && handleEventClick(yearEvents[0])}
                                        >
                                            {year.toString().split('').map((char, index) => (
                                                <span key={index} className="year-char">
            {char}
        </span>
                                            ))}
                                        </div>
                                        {/* 上方事件标题 */}
                                        {yearEvents.map((event, eventIndex) => (
                                            <div
                                                key={event.id}
                                                className="event-title-top"
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <div className="title-content">
                                                    {event.title.split('').map((char, index) => (
                                                        <span key={index} className="title-char">
                                                            {char}
                                                        </span>
                                                    ))}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 尺子中心线 */}
                        <div className="ruler-center-line"></div>

                        {/* 下方年份和标题 */}
                        <div className="ruler-bottom">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = min + i;
                                const yearEvents = eventsByYear[year];
                                const isBottomYear = i % 2 === 1; // 奇数年份在下方

                                if (!isBottomYear || !yearEvents) return null;

                                return (
                                    <div
                                        key={`bottom-${year}`}
                                        className="ruler-year-bottom"
                                        style={{ left: `${(i / totalYears) * 100}%` }}
                                    >
                                        {/* 下方事件标题 */}
                                        {yearEvents.map((event, eventIndex) => (
                                            <div
                                                key={event.id}
                                                className="event-title-bottom"
                                                onClick={() => handleEventClick(event)}
                                            >

                                                <div className="title-content">
                                                    {event.title.split('').map((char, index) => (
                                                        <span key={index} className="title-char">
                                                            {char}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* 下方年份标签 */}
                                        <div
                                            className="year-label-bottom"
                                            onClick={() => yearEvents && handleEventClick(yearEvents[0])}
                                        >
                                            {year.toString().split('').map((char, index) => (
                                                <span key={index} className="year-char">
            {char}
        </span>
                                            ))}
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
            >
                {selectedEvent && (
                    <div className="event-detail">
                        <h2>{selectedEvent.title}</h2>
                        <div className="event-meta">
                            <Tag color={getTypeColor(selectedEvent.type)}>
                                {getTypeText(selectedEvent.type)}
                            </Tag>
                            <span><EnvironmentOutlined /> {selectedEvent.location}</span>
                            <span><CalendarOutlined /> {selectedEvent.year}年</span>
                            {selectedEvent.period && (
                                <Tag color="blue">{selectedEvent.period}</Tag>
                            )}
                        </div>
                        <p className="event-description">{selectedEvent.description}</p>

                        {/* 历史事件部分 */}
                        {selectedEvent.historicalEvents && selectedEvent.historicalEvents.length > 0 && (
                            <div className="historical-events">
                                <h4>
                                    <HistoryOutlined /> 历史背景
                                </h4>
                                <div className="historical-events-list">
                                    {selectedEvent.historicalEvents.map((event, index) => (
                                        <Tooltip
                                            key={event.id}
                                            title={`${getHistoricalEventText(event.type)}事件`}
                                            placement="top"
                                        >
                                            <Tag
                                                color={getHistoricalEventColor(event.type)}
                                                className="historical-event-tag"
                                            >
                                                {event.description}
                                            </Tag>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedEvent.detailedContent && (
                            <div className="event-content">
                                <h4>详细内容</h4>
                                <p>{selectedEvent.detailedContent}</p>
                            </div>
                        )}
                        {selectedEvent.images && selectedEvent.images.length > 0 && (
                            <div className="event-images">
                                <h4>相关图片</h4>
                                <Image.PreviewGroup>
                                    {selectedEvent.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            width={200}
                                            src={image.url}
                                            alt={image.alt}
                                            className="event-image"
                                        />
                                    ))}
                                </Image.PreviewGroup>
                            </div>
                        )}
                        {selectedEvent.relatedWorks && selectedEvent.relatedWorks.length > 0 && (
                            <div className="related-works">
                                <h4>相关作品</h4>
                                <ul>
                                    {selectedEvent.relatedWorks.map((work, index) => (
                                        <li key={index}>{work.title}</li>
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

export default Timeline;