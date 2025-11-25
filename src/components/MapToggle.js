import React from 'react';
import './MapToggle.css';

function MapToggle({ currentStyle, onToggle }) {
    return (
        <div className="map-toggle" style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            zIndex: 9999,
            pointerEvents: 'auto'
        }}>
            <button
                className={`toggle-btn ${currentStyle === 'ancient' ? 'active' : ''}`}
                onClick={() => {
                    console.log('点击古地图');
                    onToggle('ancient');
                }}
                style={{ pointerEvents: 'auto' }}
            >
                古地图
            </button>
            <button
                className={`toggle-btn ${currentStyle === 'modern' ? 'active' : ''}`}
                onClick={() => {
                    console.log('点击现代地图');
                    onToggle('modern');
                }}
                style={{ pointerEvents: 'auto' }}
            >
                现代地图
            </button>
        </div>
    );
}

export default MapToggle;
