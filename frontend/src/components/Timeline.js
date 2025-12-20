import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Timeline.css';

// Import corner ornaments
import cornerTL from '../assets/corner-huiwen-tl.svg';
import cornerTR from '../assets/corner-huiwen-tr.svg';
import cornerBL from '../assets/corner-huiwen-bl.svg';
import cornerBR from '../assets/corner-huiwen-br.svg';

function Timeline({ journey, isActive, index }) {
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    return (
        <motion.div
            className={`timeline-item ${isActive ? 'item-active' : ''}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0.6, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {/* 顶部夹子 */}
            <div className="item-scroll-clip top-clip">
                <div className="item-clip-left"></div>
                <div className="item-clip-right"></div>
            </div>

            {/* 底部夹子 */}
            <div className="item-scroll-clip bottom-clip">
                <div className="item-clip-left"></div>
                <div className="item-clip-right"></div>
            </div>

            <div className="item-timeline-marker">
                <div className="item-marker-dot"></div>
                <div className="item-marker-line"></div>
            </div>

            <div className="item-timeline-content">
                {/* Ornaments now inside the content area */}
                <img src={cornerTL} className="item-ornament corner-tl" alt="" />
                <img src={cornerTR} className="item-ornament corner-tr" alt="" />
                <img src={cornerBL} className="item-ornament corner-bl" alt="" />
                <img src={cornerBR} className="item-ornament corner-br" alt="" />

                <div className="item-timeline-badge">第{index + 1}次</div>

                <h2 className="item-timeline-title">{journey.title}</h2>

                <div className="item-timeline-meta">
                    <span className="item-timeline-year">{journey.year}</span>
                    <div className="item-timeline-location">
                        <span className="item-location-icon">📍</span>
                        <span className="item-location-text">{journey.location}</span>
                    </div>
                </div>

                <p className="item-timeline-description">{journey.description}</p>

                {journey.people && journey.people.length > 0 && (
                    <div className="item-timeline-people">
                        <h4 className="item-section-title">主要交往</h4>
                        <div className="item-people-tags">
                            {journey.people.map((person, idx) => (
                                <span key={idx} className="item-person-tag">{person}</span>
                            ))}
                        </div>
                    </div>
                )}

                {journey.artworks && journey.artworks.length > 0 && (
                    <div className="item-timeline-artworks">
                        <h4 className="item-section-title">代表作品</h4>
                        <div className="item-artwork-list">
                            {journey.artworks.map((artwork, idx) => (
                                <div
                                    key={idx}
                                    className="item-artwork-item"
                                    onClick={() => setSelectedArtwork(artwork)}
                                >
                                    <div className="item-artwork-title">{artwork.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 作品预览面板 */}
            <AnimatePresence>
                {selectedArtwork && (
                    <motion.div
                        className="item-artwork-preview-panel"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="item-preview-close"
                            onClick={() => setSelectedArtwork(null)}
                        >
                            ✕
                        </button>
                        <div className="item-preview-image-container">
                            <img
                                src={selectedArtwork.image}
                                alt={selectedArtwork.title}
                                className="item-preview-artwork-image"
                            />
                        </div>
                        <div className="item-preview-artwork-info">
                            <h3 className="item-preview-artwork-title">{selectedArtwork.title}</h3>
                            <p className="item-preview-artwork-desc">{selectedArtwork.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Timeline;
