// src/pages/TimelinePage.js (完整版，包含轮播图)
import React, { useState, useEffect } from 'react';
import Timeline2 from '../components/Timeline2';
import CustomCarousel from '../components/Carousel'; // 导入轮播图组件
import { Card, Tabs } from 'antd';
import { getTimelineEvents, getCarouselImages } from '../services/TimelineDataService'; // 导入carousel数据方法
import { Link } from 'react-router-dom';
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
        <div className="TimelinePage">
            <div className="nav_logo">
                <img src="/images/list_logo.png" alt="" />
            </div>
            <div className="nav_logo2">
                <img src="/images/list_logo2.png" alt="" />
            </div>
            <Link to="/" className="a_home">
                <img src="/images/a_home.png" alt="返回首页" />
            </Link>
            <Card className="timeline-details-card">
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
            </Card>
        </div>
    );
};

export default TimelinePage;