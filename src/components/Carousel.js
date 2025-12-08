// components/Carousel/Carousel.jsx
import React from 'react';
import { Carousel, Image, Card, Empty } from 'antd';
import './Carousel.css';

const CustomCarousel = ({
                            images = [],
                            loading = false,
                            title = "相关图片",
                            height = 400
                        }) => {
    if (loading) {
        return (
            <Card className="carousel-card" loading={true}>
                <div style={{ height: `${height}px` }} />
            </Card>
        );
    }

    if (!images || images.length === 0) {
        return (
            <Card className="carousel-card" title={title}>
                <Empty
                    description="暂无相关图片"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Card className="carousel-card" title={title}>
            <Carousel
                autoplay
                effect="fade"
                dots={{ className: 'custom-dots' }}
            >
                {images.map((image, index) => (
                    <div key={index} className="carousel-slide">
                        <div className="image-container" style={{ height: `${height}px` }}>
                            <Image
                                src={image.url}
                                alt={image.alt || `轮播图 ${index + 1}`}
                                placeholder={
                                    <div className="image-placeholder">
                                        加载中...
                                    </div>
                                }
                                fallback="/images/placeholder.jpg"
                                className="carousel-image"
                            />
                        </div>
                        {image.caption && (
                            <div className="image-caption">
                                {image.caption}
                            </div>
                        )}
                    </div>
                ))}
            </Carousel>
        </Card>
    );
};

export default CustomCarousel;