import React, { useState } from 'react';
import './MapTester.css';

function MapTester({ onSelectMap }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMap, setCurrentMap] = useState('ancient-map.jpg');
    const [opacity, setOpacity] = useState(0.3);

    console.log('MapTester渲染，isOpen:', isOpen);

    // 测试地图列表
    const testMaps = [
        { id: 'ancient-map.jpg', name: '默认地图' },
        { id: 'ancient-map-1.jpg', name: '地图 1' },
        { id: 'ancient-map-2.jpg', name: '地图 2' },
        { id: 'ancient-map-3.jpg', name: '地图 3' },
        { id: 'ancient-map-4.jpg', name: '地图 4' },
        { id: 'ancient-map-5.jpg', name: '地图 5' },
    ];

    const handleMapChange = (mapId) => {
        setCurrentMap(mapId);
        onSelectMap(mapId, opacity);
    };

    const handleOpacityChange = (e) => {
        const newOpacity = parseFloat(e.target.value);
        setOpacity(newOpacity);
        onSelectMap(currentMap, newOpacity);
    };

    return (
        <>
            {/* 测试按钮 */}
            <button
                className="map-tester-toggle"
                onClick={() => {
                    console.log('🎨按钮被点击！');
                    setIsOpen(!isOpen);
                }}
                title="地图测试工具"
            >
                🎨
            </button>

            {/* 测试面板 */}
            {isOpen && (
                <div className="map-tester-panel">
                    <div className="tester-header">
                        <h3>古地图测试工具</h3>
                        <button
                            className="tester-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="tester-content">
                        {/* 地图选择 */}
                        <div className="tester-section">
                            <label>选择地图：</label>
                            <div className="map-grid">
                                {testMaps.map(map => (
                                    <div
                                        key={map.id}
                                        className={`map-option ${currentMap === map.id ? 'active' : ''}`}
                                        onClick={() => handleMapChange(map.id)}
                                    >
                                        <div
                                            className="map-preview"
                                            style={{
                                                backgroundImage: `url('/images/${map.id}')`,
                                            }}
                                        >
                                            {currentMap === map.id && (
                                                <div className="active-badge">✓</div>
                                            )}
                                        </div>
                                        <span className="map-name">{map.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 透明度调整 */}
                        <div className="tester-section">
                            <label>
                                透明度：{Math.round(opacity * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="0.8"
                                step="0.05"
                                value={opacity}
                                onChange={handleOpacityChange}
                                className="opacity-slider"
                            />
                            <div className="opacity-labels">
                                <span>淡</span>
                                <span>适中</span>
                                <span>浓</span>
                            </div>
                        </div>

                        {/* 当前配置 */}
                        <div className="tester-section current-config">
                            <h4>当前配置</h4>
                            <div className="config-item">
                                <span>地图：</span>
                                <code>{currentMap}</code>
                            </div>
                            <div className="config-item">
                                <span>透明度：</span>
                                <code>{opacity}</code>
                            </div>
                        </div>

                        {/* 使用说明 */}
                        <div className="tester-section usage-tips">
                            <h4>💡 使用提示</h4>
                            <ul>
                                <li>将测试图片命名为 ancient-map-1.jpg, ancient-map-2.jpg 等</li>
                                <li>放置在 public/images/ 文件夹</li>
                                <li>点击预览图切换不同地图</li>
                                <li>调整透明度查看效果</li>
                                <li>选好后记录文件名和透明度值</li>
                            </ul>
                        </div>

                        {/* 快捷操作 */}
                        <div className="tester-section quick-actions">
                            <button
                                className="action-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `文件名: ${currentMap}\n透明度: ${opacity}`
                                    );
                                    alert('配置已复制到剪贴板！');
                                }}
                            >
                                📋 复制配置
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => {
                                    setOpacity(0.3);
                                    onSelectMap(currentMap, 0.3);
                                }}
                            >
                                🔄 重置透明度
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MapTester;
