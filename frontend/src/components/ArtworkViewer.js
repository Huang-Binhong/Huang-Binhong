import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './ArtworkViewer.css';

function ArtworkViewer({ artwork, onClose }) {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <motion.div
            className="artwork-viewer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="artwork-viewer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="viewer-header">
                    <div className="viewer-title-section">
                        <h2 className="viewer-title">{artwork.title}</h2>
                        <p className="viewer-subtitle">{artwork.description}</p>
                    </div>
                    <button className="viewer-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="viewer-content">
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        centerOnInit={true}
                        onZoomStart={() => setIsZoomed(true)}
                        onZoomStop={(ref) => {
                            if (ref.state.scale === 1) setIsZoomed(false);
                        }}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div className="viewer-controls">
                                    <button className="control-btn" onClick={() => zoomIn()}>
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <button className="control-btn" onClick={() => zoomOut()}>
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <button className="control-btn" onClick={() => resetTransform()}>
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>

                                <TransformComponent
                                    wrapperClass="transform-wrapper"
                                    contentClass="transform-content"
                                >
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                        className="artwork-image-full"
                                    />
                                </TransformComponent>

                                {!isZoomed && (
                                    <div className="viewer-hint">
                                        <p>💡 滚动鼠标或双指缩放查看细节</p>
                                    </div>
                                )}
                            </>
                        )}
                    </TransformWrapper>
                </div>

                <div className="viewer-footer">
                    <div className="artwork-details">
                        <div className="detail-item">
                            <span className="detail-label">作品名称</span>
                            <span className="detail-value">{artwork.title}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">作品描述</span>
                            <span className="detail-value">{artwork.description}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ArtworkViewer;
