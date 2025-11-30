import { ZoomIn, ZoomOut, X, Box, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { NetworkVisualization3D } from './NetworkVisualization3D';
import './VisualizationPanel.css';

interface VisualizationPanelProps {
    imageBase64: string;
    onClose: () => void;
}

export const VisualizationPanel = ({ imageBase64, onClose }: VisualizationPanelProps) => {
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

    return (
        <div className="visualization-overlay" onClick={onClose}>
            <div className="visualization-panel glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="panel-header">
                    <h2 className="gradient-text">Decision Network Visualization</h2>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
                            onClick={() => setViewMode('2d')}
                        >
                            <ImageIcon size={16} /> 2D Graph
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
                            onClick={() => setViewMode('3d')}
                        >
                            <Box size={16} /> 3D Network
                        </button>
                    </div>

                    <div className="panel-controls">
                        {viewMode === '2d' && (
                            <>
                                <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">
                                    <ZoomOut size={18} />
                                </button>
                                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                                <button className="control-btn" onClick={handleZoomIn} title="Zoom In">
                                    <ZoomIn size={18} />
                                </button>
                            </>
                        )}
                        <button className="control-btn close-btn" onClick={onClose} title="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="image-container">
                    {viewMode === '3d' ? (
                        <>
                            <NetworkVisualization3D />
                            <div className="viz-info">
                                Drag to rotate • Scroll to zoom • Interactive 3D network
                            </div>
                        </>
                    ) : (
                        <>
                            <img
                                src={`data:image/png;base64,${imageBase64}`}
                                alt="Board Decision Visualization"
                                style={{ transform: `scale(${zoom})` }}
                                className="decision-graph"
                            />
                            <div className="viz-info">
                                Agent decision flow diagram
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
