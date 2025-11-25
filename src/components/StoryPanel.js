import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtworkViewer from './ArtworkViewer';
import './StoryPanel.css';

function StoryPanel({ journey, onClose }) {
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    return (
        <>
            <motion.div
                className="story-panel-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className="story-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                {/* Corner Decorations */}
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>

                <div className="panel-header">
                    <h2 className="panel-title">{journey.location}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="panel-content">
                    <div className="journey-info">
                        <div className="info-item">
                            <span className="info-label">时期</span>
                            <span className="info-value">{journey.year}</span>
                        </div>
                        <div className="info-divider"></div>
                        <div className="info-item">
                            <span className="info-label">地点</span>
                            <span className="info-value">{journey.location}</span>
                        </div>
                    </div>

                    <div className="journey-description">
                        <h3 className="section-title">游历记述</h3>
                        <p className="description-text">{journey.description}</p>
                    </div>

                    {journey.people && journey.people.length > 0 && (
                        <div className="journey-people">
                            <h3 className="section-title">主要交往</h3>
                            <div className="people-grid">
                                {journey.people.map((person, i) => (
                                    <div key={i} className="person-card">
                                        <div className="person-avatar">{person.charAt(0)}</div>
                                        <span className="person-name">{person}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {journey.artworks && journey.artworks.length > 0 && (
                        <div className="journey-artworks">
                            <h3 className="section-title">代表作品</h3>
                            <div className="artworks-grid">
                                {journey.artworks.map((artwork, i) => (
                                    <motion.div
                                        key={i}
                                        className="artwork-card"
                                        whileHover={{ scale: 1.03 }}
                                        onClick={() => setSelectedArtwork(artwork)}
                                    >
                                        <div className="artwork-image">
                                            <img src={artwork.image} alt={artwork.title} />
                                            <div className="artwork-overlay">
                                                <span className="view-text">查看详情</span>
                                            </div>
                                        </div>
                                        <div className="artwork-info">
                                            <h4 className="artwork-title">{artwork.title}</h4>
                                            <p className="artwork-desc">{artwork.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 作品查看器 */}
            <AnimatePresence>
                {selectedArtwork && (
                    <ArtworkViewer
                        artwork={selectedArtwork}
                        onClose={() => setSelectedArtwork(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default StoryPanel;
