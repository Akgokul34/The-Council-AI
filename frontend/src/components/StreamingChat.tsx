import { useState, useEffect, useRef } from 'react';
import { AgentAvatar } from './AgentAvatar';
import './StreamingChat.css';

interface StreamingChatProps {
    query: string;
    onComplete: () => void;
}

interface ChatMessage {
    agent: string;
    text: string;
    timestamp: number;
}

export const StreamingChat = ({ query, onComplete }: StreamingChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentAgent, setCurrentAgent] = useState<string>('System');
    const wsRef = useRef<WebSocket | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/board`;

        console.log("Connecting to WS:", wsUrl);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WS Connected");
            ws.send(JSON.stringify({ query }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'update') {
                    setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.agent === data.agent) {
                            return [
                                ...prev.slice(0, -1),
                                { ...lastMsg, text: lastMsg.text + data.text }
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
                    onComplete();
                }
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        ws.onerror = (e) => {
            console.error('WebSocket error:', e);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [query, onComplete]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="streaming-chat glass-card">
            <div className="chat-header">
                <div className="header-title">
                    <h3 className="gradient-text">Board Deliberation in Progress</h3>
                    <span className="live-indicator">
                        <span className="dot"></span> LIVE
                    </span>
                </div>
            </div>

            <div className="chat-window">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-row ${msg.agent === 'System' ? 'system' : ''} fade-in`}>
                        <div className="agent-column">
                            <AgentAvatar agentName={msg.agent} size="sm" />
                        </div>
                        <div className="message-content">
                            <div className="message-sender">{msg.agent}</div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    </div>
                ))}

                <div className="typing-indicator-row">
                    <div className="agent-column">
                        <AgentAvatar agentName={currentAgent} size="sm" state="thinking" />
                    </div>
                    <div className="typing-content">
                        <span className="typing-text">{currentAgent} is speaking...</span>
                    </div>
                </div>

                <div ref={chatEndRef} />
            </div>
        </div>
    );
};
