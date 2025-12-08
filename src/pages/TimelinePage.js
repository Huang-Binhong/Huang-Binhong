// src/pages/TimelinePage.js (完整版，包含轮播图)
import React, { useState, useEffect } from 'react';
import Timeline2 from '../components/Timeline2';
import CustomCarousel from '../components/Carousel'; // 导入轮播图组件
import { Card, Tabs } from 'antd';
import { getTimelineEvents, getCarouselImages } from '../services/TimelineDataService'; // 导入carousel数据方法

const TimelinePage = () => {
    const [personalEvents, setPersonalEvents] = useState([]);
    const [historicalEvents, setHistoricalEvents] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]); // 添加轮播图状态
    const [carouselLoading, setCarouselLoading] = useState(true); // 添加轮播图加载状态
    const [timelineLoading, setTimelineLoading] = useState(true); // 单独的时间轴加载状态

    useEffect(() => {
        fetchTimelineData();
        fetchCarouselData();
    }, []);

    const fetchTimelineData = async () => {
        setTimelineLoading(true);
        try {
            const response = await getTimelineEvents();
            if (response.code === 0) {
                setPersonalEvents(response.data.personalEvents || []);
                setHistoricalEvents(response.data.historicalEvents || []);
            }
        } catch (error) {
            console.error('获取时间轴数据失败:', error);
        } finally {
            setTimelineLoading(false);
        }
    };

    const fetchCarouselData = async () => {
        setCarouselLoading(true);
        try {
            const response = await getCarouselImages();
            if (response.code === 0) {
                setCarouselImages(response.data.items || []);
            }
        } catch (error) {
            console.error('获取轮播图数据失败:', error);
        } finally {
            setCarouselLoading(false);
        }
    };

    return (
        <div className="bio-page">
            <Card className="bio-details-card">
                <Tabs
                    defaultActiveKey="timeline"
                    items={[
                        {
                            key: 'timeline',
                            label: '生平时间轴',
                            children: (
                                <>
                                    <div className="timeline-page">
                                        <Timeline2
                                            personalEvents={personalEvents}
                                            historicalEvents={historicalEvents}
                                            loading={timelineLoading}
                                        />
                                    </div>

                                    {/* 轮播图部分 */}
                                    <CustomCarousel
                                        images={carouselImages}
                                        loading={carouselLoading}
                                        title="黄宾虹生平影像"
                                        height={400}
                                    />
                                </>
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

export default TimelinePage;