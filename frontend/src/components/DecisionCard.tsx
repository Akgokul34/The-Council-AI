import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { api, type BoardResponse } from '../services/api';
import './DecisionCard.css';

interface DecisionCardProps {
    response: BoardResponse;
}

export const DecisionCard = ({ response }: DecisionCardProps) => {
    const [expandedOption, setExpandedOption] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            await api.downloadReport(response);
        } catch (e) {
            console.error("Download failed", e);
            alert("Failed to download report");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="decision-card glass-card fade-in">
            <div className="card-header">
                <div className="header-icon">
                    <FileText size={24} />
                </div>
                <div className="header-content">
                    <h2>Executive Summary</h2>
                    <p>{response.executive_summary}</p>
                </div>
                <button
                    className="download-btn"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    title="Download PDF Report"
                >
                    {isDownloading ? (
                        <span className="spinner-sm"></span>
                    ) : (
                        <Download size={20} />
                    )}
                </button>
            </div>

            <div className="strategic-options">
                <h3>Strategic Options</h3>
                <div className="options-grid">
                    {response.strategic_options.map((option, index) => (
                        <div
                            key={index}
                            className={`option-item ${expandedOption === index ? 'expanded' : ''}`}
                            onClick={() => setExpandedOption(expandedOption === index ? null : index)}
                        >
                            <div className="option-header">
                                <span className="option-number">0{index + 1}</span>
                                <h4>{option.option}</h4>
                                {expandedOption === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {expandedOption === index && (
                                <div className="option-details slide-down">
                                    <div className="pros-cons">
                                        <div className="pros">
                                            <h5>Pros</h5>
                                            <p>{option.pros}</p>
                                        </div>
                                        <div className="cons">
                                            <h5>Cons</h5>
                                            <p>{option.cons}</p>
                                        </div>
                                    </div>
                                    {option.backing_evidence && (
                                        <div className="evidence">
                                            <h5>Evidence</h5>
                                            <p>{option.backing_evidence}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="risks-section">
                <h3><AlertTriangle size={20} /> Critical Risks</h3>
                <ul>
                    {response.risks_to_address.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                    ))}
                </ul>
            </div>

            <div className="final-verdict-container">
                <div className="verdict-header">
                    <div className="verdict-icon">
                        <CheckCircle size={28} />
                    </div>
                    <h3>Final Recommendation</h3>
                </div>
                <div className="verdict-content">
                    <p>{response.final_verdict}</p>
                </div>
                <div className="verdict-footer">
                    <span className="verdict-badge">Board Decision</span>
                </div>
            </div>
        </div>
    );
};
