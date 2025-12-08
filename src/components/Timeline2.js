// src/components/Timeline2/Timeline2.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, Tag, Image, Modal, Button, Tooltip } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    LeftOutlined,
    RightOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { getHistoricalEventColor, getHistoricalEventText } from '../services/TimelineDataService';
import './Timeline2.css';

const Timeline2 = ({ personalEvents = [], historicalEvents = [], loading }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const timelineRef = useRef(null);

    // 固定时间范围 1865-1955
    const minYear = 1865;
    const maxYear = 1955;
    const totalYears = maxYear - minYear;

    // 每个年份的宽度（像素）
    const yearWidth = 180;

    // 按年份分组事件
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

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const getTypeColor = (type) => {
        const colors = {
            birth: '#2E2E2E',
            education: '#556B2F',
            work: '#8B4513',
            creation: '#3B4F3A',
            award: '#D4A451',
            death: '#696969',
            travel: '#2E8B57',
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
            timelineRef.current.scrollLeft -= 500;
            setScrollPosition(timelineRef.current.scrollLeft);
        }
    };

    const scrollRight = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft += 500;
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

    const hasEvents = personalEvents.length > 0 || historicalEvents.length > 0;
    if (!hasEvents) {
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
                <div className="nav-info">
                    {minYear} - {maxYear}
                </div>
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
                    style={{ width: `${(totalYears + 1) * yearWidth}px` }}
                >
                    {/* 双面尺子 */}
                    <div className="double-ruler">
                        {/* 时间轴标尺 - 显示所有年份 */}
                        <div className="timeline-ruler">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                return (
                                    <div
                                        key={`tick-${year}`}
                                        className="ruler-tick"
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

                        {/* 尺子中心线 */}
                        <div className="ruler-center-line"></div>

                        {/* 上方：人物生平 */}
                        <div className="ruler-top">
                            {Array.from({ length: totalYears + 1 }, (_, i) => {
                                const year = minYear + i;
                                const yearEvents = personalEventsByYear[year];
                                const leftPosition = (i * yearWidth) + (yearWidth / 2);

                                if (!yearEvents) return null;

                                return (
                                    <div
                                        key={`personal-${year}`}
                                        className="event-year-container event-year-top"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        {/* 年份指示器 */}
                                        <div className="year-indicator">
                                            <div className="year-dot"></div>
                                        </div>

                                        {/* 上方事件卡片 */}
                                        {yearEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="event-card-top"
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <div className="event-card-content">
                                                    <div className="event-title">
                                                        {event.title}
                                                    </div>
                                                    <div className="event-type">
                                                        <Tag color={getTypeColor(event.type)} size="small">
                                                            {getTypeText(event.type)}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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

                                return (
                                    <div
                                        key={`historical-${year}`}
                                        className="event-year-container event-year-bottom"
                                        style={{ left: `${leftPosition}px` }}
                                    >
                                        {/* 年份指示器 */}
                                        <div className="year-indicator">
                                            <div className="year-dot"></div>
                                        </div>

                                        {/* 下方事件卡片 */}
                                        {yearEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="event-card-bottom"
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <div className="event-card-content">
                                                    <div className="event-title">
                                                        {event.title}
                                                    </div>
                                                    <div className="event-type">
                                                        <Tag color={getTypeColor(event.type)} size="small">
                                                            {getTypeText(event.type)}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 滚动指示器 */}
            <div className="scroll-indicator">
                <div className="scroll-progress">
                    <div
                        className="scroll-bar"
                        style={{
                            width: `${(scrollPosition / (timelineRef.current?.scrollWidth - timelineRef.current?.clientWidth || 1)) * 100}%`
                        }}
                    ></div>
                </div>
                <div className="scroll-hint">
                    使用左右按钮或拖动滚动条浏览完整时间轴
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
                            <span><CalendarOutlined /> {selectedEvent.year}年</span>
                            {selectedEvent.location && (
                                <span><EnvironmentOutlined /> {selectedEvent.location}</span>
                            )}
                            {selectedEvent.period && (
                                <Tag color="blue">{selectedEvent.period}</Tag>
                            )}
                        </div>

                        <p className="event-description">{selectedEvent.description}</p>

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

export default Timeline2;