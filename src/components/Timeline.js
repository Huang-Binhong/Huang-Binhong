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
            className={`timeline-item ${isActive ? 'active' : ''}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0.6, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {/* 顶部夹子 */}
            <div className="scroll-clip top-clip">
                <div className="clip-left"></div>
                <div className="clip-right"></div>
            </div>

            {/* 底部夹子 */}
            <div className="scroll-clip bottom-clip">
                <div className="clip-left"></div>
                <div className="clip-right"></div>
            </div>

            <div className="timeline-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
            </div>

            <div className="timeline-content">
                {/* Ornaments now inside the content area */}
                <img src={cornerTL} className="ornament corner-tl" alt="" />
                <img src={cornerTR} className="ornament corner-tr" alt="" />
                <img src={cornerBL} className="ornament corner-bl" alt="" />
                <img src={cornerBR} className="ornament corner-br" alt="" />

                <div className="timeline-badge">第{index + 1}次</div>

                <h2 className="timeline-title">{journey.title}</h2>

                <div className="timeline-meta">
                    <span className="timeline-year">{journey.year}</span>
                    <div className="timeline-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{journey.location}</span>
                    </div>
                </div>

                <p className="timeline-description">{journey.description}</p>

                {journey.people && journey.people.length > 0 && (
                    <div className="timeline-people">
                        <h4 className="section-title">主要交往</h4>
                        <div className="people-tags">
                            {journey.people.map((person, idx) => (
                                <span key={idx} className="person-tag">{person}</span>
                            ))}
                        </div>
                    </div>
                )}

                {journey.artworks && journey.artworks.length > 0 && (
                    <div className="timeline-artworks">
                        <h4 className="section-title">代表作品</h4>
                        <div className="artwork-list">
                            {journey.artworks.map((artwork, idx) => (
                                <div
                                    key={idx}
                                    className="artwork-item"
                                    onClick={() => setSelectedArtwork(artwork)}
                                >
                                    <div className="artwork-title">{artwork.title}</div>
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
                        className="artwork-preview-panel"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="preview-close"
                            onClick={() => setSelectedArtwork(null)}
                        >
                            ✕
                        </button>
                        <div className="preview-image-container">
                            <img
                                src={selectedArtwork.image}
                                alt={selectedArtwork.title}
                                className="preview-artwork-image"
                            />
                        </div>
                        <div className="preview-artwork-info">
                            <h3 className="preview-artwork-title">{selectedArtwork.title}</h3>
                            <p className="preview-artwork-desc">{selectedArtwork.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Timeline;
