import { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';
import './ExecutionPanel.css';

interface ExecutionPanelProps {
    planContext: string;
    onClose: () => void;
}

interface LogEntry {
    agent: string;
    text: string;
    timestamp: number;
}

export const ExecutionPanel = ({ planContext, onClose }: ExecutionPanelProps) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [status, setStatus] = useState<'connecting' | 'running' | 'completed' | 'error'>('connecting');
    const [currentAgent, setCurrentAgent] = useState<string>('System');
    const wsRef = useRef<WebSocket | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/execution`;

        console.log("Connecting to Execution WS:", wsUrl);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Execution WS Connected");
            setStatus('running');
            ws.send(JSON.stringify({ plan: planContext }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'update') {
                    setLogs(prev => {
                        const lastLog = prev[prev.length - 1];
                        if (lastLog && lastLog.agent === data.agent) {
                            return [
                                ...prev.slice(0, -1),
                                { ...lastLog, text: lastLog.text + data.text }
                            ];
                        }
                        return [...prev, {
                            agent: data.agent,
                            text: data.text,
                            timestamp: Date.now()
                        }];
                    });
                    setCurrentAgent(data.agent);
                } else if (data.type === 'complete') {
                    setStatus('completed');
                    setCurrentAgent('System');
                } else if (data.type === 'error') {
                    setStatus('error');
                    setLogs(prev => [...prev, { agent: 'System', text: `Error: ${data.message}`, timestamp: Date.now() }]);
                }
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket error:", e);
            setStatus('error');
        };

        ws.onclose = () => {
            console.log("Execution WS Closed");
            if (status !== 'completed') {
                setStatus('completed');
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [planContext, status]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const formatLogText = (text: string) => {
        if (text.includes('```json')) {
            return (
                <div className="code-block">
                    <pre>{text.replace(/```json|```/g, '')}</pre>
                </div>
            );
        }
        return <p>{text}</p>;
    };

    return (
        <div className="execution-overlay">
            <div className="execution-panel glass-card">
                <div className="panel-header">
                    <div className="header-title">
                        <Terminal size={24} className="text-blue-400" />
                        <h2 className="gradient-text">Execution Squad</h2>
                    </div>
                    <div className="header-controls">
                        <div className="status-badge">
                            {status === 'running' && <><Loader size={16} className="spin" /> Executing</>}
                            {status === 'completed' && <><CheckCircle size={16} className="text-green-400" /> Completed</>}
                            {status === 'error' && <><AlertTriangle size={16} className="text-red-400" /> Error</>}
                        </div>
                        <button className="close-btn" onClick={onClose}>Close</button>
                    </div>
                </div>

                <div className="active-agent-display">
                    {status === 'running' && (
                        <div className="current-agent fade-in">
                            <AgentAvatar agentName={currentAgent} state="thinking" size="md" />
                            <span className="agent-name">{currentAgent} is working...</span>
                        </div>
                    )}
                </div>

                <div className="terminal-window">
                    {logs.map((log, idx) => (
                        <div key={idx} className={`log-entry ${log.agent.toLowerCase().replace(' ', '-')}`}>
                            <div className="log-agent">
                                <AgentAvatar agentName={log.agent} size="sm" />
                            </div>
                            <div className="log-content">
                                <div className="log-header">
                                    <span className="agent-label">{log.agent}</span>
                                    <span className="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="log-text">
                                    {formatLogText(log.text)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    );
};
