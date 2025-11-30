import { useState } from 'react';
import { Send, Sparkles, Brain, Zap, Info } from 'lucide-react';
import './QueryForm.css';

interface QueryFormProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
}

export const QueryForm = ({ onSubmit, isLoading }: QueryFormProps) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'analysis' | 'execution'>('analysis');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSubmit(query);
        }
    };

    const getCharacterFeedback = () => {
        const length = query.length;
        if (length === 0) return { text: 'Start typing your strategic question...', color: 'muted' };
        if (length < 50) return { text: 'Add more details for better analysis', color: 'warning' };
        if (length < 200) return { text: 'Good detail level', color: 'success' };
        return { text: `${length} characters - Comprehensive question`, color: 'success' };
    };

    const feedback = getCharacterFeedback();

    return (
        <form className="query-form glass-card" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2 className="gradient-text">Consult The Council</h2>
                <p className="form-subtitle">
                    Ask your strategic question and our AI board will deliberate,
                    then execute a plan with our expert agents
                </p>
            </div>

            {/* Mode Selection */}
            <div className="mode-selector">
                <div className="mode-label">
                    <Brain size={18} />
                    <span>Consultation Mode</span>
                </div>
                <div className="mode-buttons">
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'analysis' ? 'active' : ''}`}
                        onClick={() => setMode('analysis')}
                        disabled={isLoading}
                    >
                        <Sparkles size={16} />
                        <div className="mode-info">
                            <span className="mode-name">Quick Analysis</span>
                            <span className="mode-desc">Strategic board discussion only</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'execution' ? 'active' : ''}`}
                        onClick={() => setMode('execution')}
                        disabled={isLoading}
                    >
                        <Zap size={16} />
                        <div className="mode-info">
                            <span className="mode-name">Deep Execution</span>
                            <span className="mode-desc">Strategy + planning + coding + review</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            {mode === 'execution' && (
                <div className="info-banner">
                    <Info size={16} />
                    <span>
                        Execution mode activates our specialist team:
                        <strong> Architect</strong> (planning),
                        <strong> Engineer</strong> (coding), and
                        <strong> QA</strong> (review)
                    </span>
                </div>
            )}

            <div className="input-wrapper">
                <textarea
                    className="query-input gradient-border"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={mode === 'analysis'
                        ? "e.g., Should our company invest in developing a new social media platform dedicated to sustainable farming?"
                        : "e.g., Build a real-time collaborative whiteboard app with WebSockets, drag-and-drop, and multi-user cursors"
                    }
                    rows={5}
                    disabled={isLoading}
                />
                <div className={`char-feedback ${feedback.color}`}>
                    {feedback.text}
                </div>
            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={!query.trim() || isLoading}
            >
                <Send size={20} />
                <span>{isLoading ? 'Board Deliberating...' : 'Submit to Council'}</span>
            </button>
        </form>
    );
};
