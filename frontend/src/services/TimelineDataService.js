// src/services/TimelineDataService.js

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 获取时间线事件
export const getTimelineEvents = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/timeline/events`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取时间线数据失败:', error);
        return {
            code: 0,
            data: {
                personalEvents: [],
                historicalEvents: []
            }
        };
    }
};

// 获取轮播图图片
export const getCarouselImages = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/timeline/carousel`);
        const data = await response.json();
        // 处理图片数据，转换为 Carousel 组件期望的格式
        if (data.data && data.data.items) {
            data.data.items = data.data.items.map(item => {
                const imageUrl = item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`;
                return {
                    ...item,
                    url: imageUrl,      // Carousel 组件使用 url
                    alt: item.title,    // Carousel 组件使用 alt
                    caption: item.title // Carousel 组件使用 caption
                };
            });
        }
        return data;
    } catch (error) {
        console.error('获取轮播图数据失败:', error);
        return {
            code: 0,
            data: {
                items: []
            }
        };
    }
};

export default {
    getTimelineEvents,
    getCarouselImages
};
