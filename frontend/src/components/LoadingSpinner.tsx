import { useEffect, useState } from 'react';
import { Brain, Search, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import './LoadingSpinner.css';

const stages = [
    { icon: Search, label: 'The Analyst researching...', color: '#4facfe' },
    { icon: Lightbulb, label: 'The Visionary ideating...', color: '#38ef7d' },
    { icon: AlertTriangle, label: 'The Risk Officer assessing...', color: '#ffae00' },
    { icon: Brain, label: 'The Chairman synthesizing...', color: '#764ba2' },
];

export const LoadingSpinner = () => {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage((prev) => (prev + 1) % stages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-card glass-card">
                <div className="orbital-spinner">
                    <div className="orbit orbit-1"></div>
                    <div className="orbit orbit-2"></div>
                    <div className="orbit orbit-3"></div>
                    <div className="nucleus"></div>
                </div>

                <div className="stages-container">
                    {stages.map((stage, index) => {
                        const Icon = stage.icon;
                        const isActive = index === currentStage;
                        const isCompleted = index < currentStage;

                        return (
                            <div
                                key={index}
                                className={`stage-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="stage-icon" style={{ borderColor: stage.color }}>
                                    {isCompleted ? (
                                        <CheckCircle size={20} color={stage.color} />
                                    ) : (
                                        <Icon size={20} color={isActive ? stage.color : '#6b6c7e'} />
                                    )}
                                </div>
                                <span className="stage-label" style={{ color: isActive ? stage.color : undefined }}>
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
