# 🏛️ The Council AI

> **Transform strategic decisions from weeks to minutes** with an AI-powered Board of Directors that debates, deliberates, and delivers—then autonomously executes the plan.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)

---

## 🎯 What is The Council AI?

The Council AI simulates a complete **Board of Directors** with six specialized AI agents working in two teams:

### 📊 The Strategic Council (Parallel Deliberation)
- **The Analyst** 🔍 - Decomposes questions, performs market research via Google Search, extracts evidence
- **The Visionary** 💡 - Proposes radical, high-growth solutions without constraints
- **The Risk Officer** ⚠️ - Identifies pitfalls, regulatory issues, and potential failures
- **The Chairman** 👔 - Synthesizes all perspectives into a structured decision

### ⚙️ The Execution Squad (Sequential Implementation)
- **The Architect** 📐 - Converts strategy into technical implementation plans
- **The Engineer** 💻 - Writes production-ready code
- **The QA Specialist** ✅ - Reviews code for security, syntax, and alignment

---

## ✨ Features

- 🔄 **Multi-Agent Orchestration** - Parallel debate + Sequential execution
- 🌐 **Real-time Streaming** - Watch agents deliberate via WebSockets
- 🔍 **Google Search Integration** - Live market research and data mining
- 💾 **Session Management** - Maintains context across the entire conversation
- 📊 **3D Visualization** - Interactive network graph of decision relationships
- 📄 **PDF Reports** - Download professional board minutes
- 🎨 **Glassmorphism UI** - Modern, premium interface

---

## � Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/The_Council_AI.git
cd The_Council_AI
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
# Create a .env file or set environment variable:
export GOOGLE_API_KEY="your-api-key-here"
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run build
cd ..
```

4. **Run the Application**
```bash
python run_server.py
```

5. **Access the UI**
```
Open http://localhost:8000 in your browser
```

---

## 💡 Usage Examples

### Strategic Analysis
Ask complex business questions:
- *"Should we adopt a 4-day work week?"*
- *"Is now the right time to expand to the European market?"*
- *"Should we replace our customer support team with AI?"*

The Council will:
1. 🔍 Research market trends and evidence
2. 💡 Propose innovative solutions
3. ⚠️ Identify risks and mitigation strategies
4. 👔 Deliver a synthesized recommendation

### Deep Execution Mode
Request technical implementations:
- *"Create a Python script to analyze sales data and generate charts"*
- *"Build a REST API for user authentication"*

The Execution Squad will:
1. 📐 Design the architecture
2. 💻 Write the code
3. ✅ Review for quality and security

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│          User Query                     │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│    Strategic Council (ParallelAgent)    │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │Analyst  │ │Visionary│ │Risk      │  │
│  │(+Search)│ │         │ │Officer   │  │
│  └─────────┘ └─────────┘ └──────────┘  │
└────────────────┬────────────────────────┘
                 ↓
         ┌───────────────┐
         │  Chairman     │
         │  (Synthesizer)│
         └───────┬───────┘
                 ↓
      [Strategic Decision JSON]
                 ↓
┌─────────────────────────────────────────┐
│  Execution Squad (SequentialAgent)      │
│  ┌─────────┐→┌─────────┐→┌──────────┐  │
│  │Architect│ │Engineer │ │QA        │  │
│  └─────────┘ └─────────┘ └──────────┘  │
└─────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI, Python 3.10+ |
| **AI Framework** | Google AI Development Kit (ADK) |
| **LLM** | Gemini 2.5 Flash Lite |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | CSS (Glassmorphism) |
| **Real-time** | WebSockets |
| **Visualization** | D3.js, Three.js |
| **PDF Generation** | ReportLab |

---

## � Project Structure

```
The_Council_AI/
├── app/
│   ├── agents.py          # Agent definitions & orchestration
│   ├── main.py            # FastAPI server & WebSocket endpoints
│   ├── models.py          # Pydantic models
│   ├── utils.py           # Visualization & tools
│   └── reports.py         # PDF generation
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Frontend utilities
│   │   └── App.tsx        # Main application
│   └── package.json
├── requirements.txt
└── run_server.py
```

---

## � Course Learnings Demonstrated

This project was built as part of the **Google AI Agents Intensive Course** and demonstrates:

✅ **Multi-Agent Systems** - Parallel & Sequential orchestration  
✅ **Tool Integration** - Google Search + Custom tools  
✅ **Sessions & Memory** - InMemorySessionService for state management  
✅ **Observability** - Real-time logging via WebSockets  

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Google AI Development Kit](https://github.com/google/adk)
- Powered by [Gemini API](https://ai.google.dev/)
- Part of the [Kaggle AI Agents Intensive Course](https://www.kaggle.com/)

---
