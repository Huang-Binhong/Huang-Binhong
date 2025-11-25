// pages/Bio/BioPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Tabs, message } from 'antd';
import Timeline from '../../components/Timeline/Timeline';
import CustomCarousel from '../../components/Carousel/Carousel';
import { getTimelineEvents, getCarouselImages } from '../../services/bioDataService';

const BioPage = () => {
    const [loading, setLoading] = useState(true);
    const [carouselLoading, setCarouselLoading] = useState(true);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);

    // 获取时间轴数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getTimelineEvents();
                if (response.code === 0) {
                    setTimelineEvents(response.data);
                } else {
                    message.error('获取时间轴数据失败');
                }
            } catch (error) {
                console.error('获取时间轴数据失败:', error);
                message.error('加载时间轴数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 获取轮播图数据
    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                setCarouselLoading(true);
                const response = await getCarouselImages();
                if (response.code === 0) {
                    setCarouselImages(response.data.items);
                } else {
                    message.error('获取轮播图数据失败');
                }
            } catch (error) {
                console.error('获取轮播图数据失败:', error);
                message.error('加载轮播图数据失败');
            } finally {
                setCarouselLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

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
                                    <Timeline
                                        events={timelineEvents}
                                        loading={loading}
                                    />

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

export default BioPage;