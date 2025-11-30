import { Search, Lightbulb, ShieldAlert, Crown, User } from 'lucide-react';
import './AgentAvatar.css';

export type AgentType = 'Analyst' | 'Visionary' | 'Risk Officer' | 'Chairman' | 'System';
export type AvatarState = 'idle' | 'thinking' | 'speaking';

interface AgentAvatarProps {
    agentName: string;
    state?: AvatarState;
    size?: 'sm' | 'md' | 'lg';
}

const getAgentConfig = (name: string) => {
    if (name.includes('Analyst')) return { icon: Search, color: '#4facfe', type: 'Analyst' };
    if (name.includes('Visionary')) return { icon: Lightbulb, color: '#38ef7d', type: 'Visionary' };
    if (name.includes('Risk')) return { icon: ShieldAlert, color: '#ffae00', type: 'Risk Officer' };
    if (name.includes('Chairman')) return { icon: Crown, color: '#764ba2', type: 'Chairman' };
    return { icon: User, color: '#b8b9c9', type: 'System' };
};

export const AgentAvatar = ({ agentName, state = 'idle', size = 'md' }: AgentAvatarProps) => {
    const config = getAgentConfig(agentName);
    const Icon = config.icon;

    return (
        <div className={`agent-avatar ${size} ${state}`} style={{ '--agent-color': config.color } as React.CSSProperties}>
            <div className="avatar-circle">
                <Icon size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
            </div>
            {state === 'thinking' && (
                <div className="thinking-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                </div>
            )}
            {state === 'speaking' && (
                <div className="speaking-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                </div>
            )}
        </div>
    );
};
