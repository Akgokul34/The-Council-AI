import { useState } from 'react';
import { Eye, Sparkles, Zap, Shield, Play } from 'lucide-react';
import { QueryForm } from './components/QueryForm';
import { StreamingChat } from './components/StreamingChat';
import { DecisionCard } from './components/DecisionCard';
import { VisualizationPanel } from './components/VisualizationPanel';
import { ExecutionPanel } from './components/ExecutionPanel';
import { api, type BoardResponse } from './services/api';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BoardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visualization, setVisualization] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleQuery = (query: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setVisualization(null);
    setCurrentQuery(query);
  };

  const handleStreamComplete = async () => {
    try {
      const result = await api.runBoard(currentQuery);
      setResponse(result);

      try {
        const vizResult = await api.visualize(result);
        setVisualization(vizResult.image_base64);
      } catch (vizError) {
        console.error('Visualization error:', vizError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuery = () => {
    setResponse(null);
    setError(null);
    setVisualization(null);
  };

  const exampleQueries = [
    "What will be the impact of AI agents on software development jobs by 2027?",
    "Should our startup pivot from B2C to B2B in the current market conditions?",
    "Build a real-time chat application with WebSockets and message persistence",
    "What are the risks and opportunities of expanding into the Southeast Asian market?",
    "Create a dashboard with data visualization using React and D3.js"
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">🏛️</div>
          <h1 className="app-title gradient-text">The Council AI</h1>
        </div>
      </header>

      <main className="app-main">
        {!response && !isLoading && (
          <>
            <div className="hero-section">
              <h2 className="hero-title">
                Strategic Intelligence<br />
                <span className="gradient-text">Powered by AI Agents</span>
              </h2>
              <p className="hero-subtitle">
                Get comprehensive strategic analysis from our multi-agent board of directors,
                then watch our execution squad turn strategy into reality.
              </p>

              <div className="agents-showcase">
                <div className="agent-section">
                  <h3 className="section-title">
                    <Sparkles size={20} />
                    Strategic Council
                  </h3>
                  <div className="features-grid">
                    <div className="feature-card glass-card">
                      <Sparkles className="feature-icon" size={24} />
                      <h4>The Analyst</h4>
                      <p>Evidence mining & data-driven insights</p>
                    </div>
                    <div className="feature-card glass-card">
                      <Zap className="feature-icon" size={24} />
                      <h4>The Visionary</h4>
                      <p>Future-focused creative solutions</p>
                    </div>
                    <div className="feature-card glass-card">
                      <Shield className="feature-icon" size={24} />
                      <h4>Risk Officer</h4>
                      <p>Comprehensive risk assessment</p>
                    </div>
                  </div>
                </div>

                <div className="divider">
                  <div className="divider-line"></div>
                  <Play className="divider-icon" size={24} />
                  <div className="divider-line"></div>
                </div>

                <div className="agent-section">
                  <h3 className="section-title execution">
                    <Zap size={20} />
                    Execution Squad
                  </h3>
                  <div className="features-grid">
                    <div className="feature-card glass-card execution-card">
                      <div className="feature-icon execution">🏗️</div>
                      <h4>Architect</h4>
                      <p>Planning & system design</p>
                    </div>
                    <div className="feature-card glass-card execution-card">
                      <div className="feature-icon execution">⚙️</div>
                      <h4>Engineer</h4>
                      <p>Code generation & implementation</p>
                    </div>
                    <div className="feature-card glass-card execution-card">
                      <div className="feature-icon execution">✅</div>
                      <h4>QA Specialist</h4>
                      <p>Testing & quality assurance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <QueryForm onSubmit={handleQuery} isLoading={isLoading} />

            <div className="example-queries">
              <p className="examples-label">Try these examples:</p>
              <div className="examples-list">
                {exampleQueries.map((query, idx) => (
                  <button
                    key={idx}
                    className="example-btn glass-card"
                    onClick={() => handleQuery(query)}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {isLoading && currentQuery && (
          <StreamingChat
            query={currentQuery}
            onComplete={handleStreamComplete}
          />
        )}

        {error && (
          <div className="error-card glass-card">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button onClick={handleNewQuery} className="retry-btn">Try Again</button>
          </div>
        )}

        {response && !isLoading && (
          <>
            <DecisionCard response={response} />

            <div className="action-bar">
              <button
                className="action-btn execute-btn"
                onClick={() => setShowExecution(true)}
              >
                <Play size={20} />
                Proceed to Execution
              </button>
              {visualization && (
                <button
                  className="action-btn visualize-btn"
                  onClick={() => setShowVisualization(true)}
                >
                  <Eye size={20} />
                  View Decision Map
                </button>
              )}
              <button
                className="action-btn new-query-btn"
                onClick={handleNewQuery}
              >
                New Query
              </button>
            </div>
          </>
        )}
      </main>

      {showVisualization && visualization && (
        <VisualizationPanel
          imageBase64={visualization}
          onClose={() => setShowVisualization(false)}
        />
      )}

      {showExecution && response && (
        <ExecutionPanel
          planContext={response.final_verdict}
          onClose={() => setShowExecution(false)}
        />
      )}

      <footer className="app-footer">
        <p>Powered by Google ADK & Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
}

export default App;
