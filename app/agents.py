import os
from google.adk.agents import Agent, SequentialAgent, ParallelAgent
from google.adk.tools import google_search
from google.adk.models.google_llm import Gemini
from google.genai import types
from .utils import novelty_tool, simulator_tool

# Configuration
MODEL_NAME = "gemini-2.5-flash-lite"

retry_config = types.HttpRetryOptions(
    attempts=5, exp_base=7, initial_delay=1,
    http_status_codes=[429,500,503,504]
)

# --- AGENT DEFINITIONS ---

# 1. Analyst Sub-Agents
decomposer_agent = Agent(
    name="AnalystDecomposer",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are an expert search query decomposer. Given the user's question, create 3 targeted search probes that help find weak signals and edge-source evidence. Output only a JSON list of strings (e.g., ["query 1", "query 2"]).
""",
    output_key="decomposed_queries"
)

search_orchestrator_agent = Agent(
    name="AnalystSearchOrchestrator",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    tools=[google_search],
    instruction="""
You are a Search Orchestrator. You receive decomposed search probes in {decomposed_queries}. Call the google_search tool for each probe and collect raw results. Return a JSON object: {"search_results": [ [...], [...], ... ]}. Return only JSON (no extra explanation).
""",
    output_key="search_orchestrator_results"
)

evidence_miner_agent = Agent(
    name="AnalystEvidenceMiner",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction=(
        "You receive the raw search results in 'search_orchestrator_results'. Extract 3-5 concise factual claim statements (1-2 sentences) "
        "from the snippets and sources. Return a JSON array of claim objects with keys: 'claim' (string), 'source' (string url or origin). "
        "If evidence is missing, return an empty list. Return only valid JSON."
    ),
    output_key="claims",
)

analyst_sequence = SequentialAgent(
    name="TheAnalyst_Sequence",
    sub_agents=[decomposer_agent, search_orchestrator_agent, evidence_miner_agent],
)

# 2. The Visionary
visionary_agent = Agent(
    name="TheVisionary",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are 'The Visionary' on a board of directors. Ignore constraints and current limitations. Given the user's query, brainstorm 3 radical, high-growth, or out-of-the-box solutions/angles. Focus on 'What if?' scenarios. Return JSON: {"visionary_ideas": ["idea 1...", "idea 2...", "idea 3..."], "future_prediction": "..."}
""",
    output_key="visionary_output"
)

# 3. The Risk Officer
risk_agent = Agent(
    name="TheRiskOfficer",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are 'The Risk Officer'. Your job is to find what could go wrong. Analyze the user's query for potential pitfalls, regulatory issues, costs, or logical fallacies. Be pessimistic and protective. Return JSON: {"risks": ["risk 1...", "risk 2..."], "mitigation_strategies": ["..."]}
""",
    output_key="risk_output"
)

# 4. The Chairman
chairman_agent = Agent(
    name="TheChairman",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are the Chairman of the Board. You have received reports from three concurrent departments:
1. The Analyst (Facts/Claims): See 'claims' variable.
2. The Visionary (Ideas): See 'visionary_output'.
3. The Risk Officer (Dangers): See 'risk_output'.

Your goal: Synthesize a final strategic answer that balances these three views. Produce a concise, actionable report.

Output a FINAL JSON structure ONLY:
{
  "executive_summary": "...",
  "strategic_options": [
     {"option": "...", "pros": "...", "cons": "...", "backing_evidence": "..."}
  ],
  "risks_to_address": ["list the top 3 critical risks from the risk officer"],
  "final_verdict": "Provide a decisive recommendation to the user."
}
""",
    output_key="certified_answer"
)

# --- ORCHESTRATION ---

board_of_directors = ParallelAgent(
    name="BoardOfDirectors_Parallel",
    sub_agents=[analyst_sequence, visionary_agent, risk_agent],
)

root_agent = SequentialAgent(
    name="BoardOfDirectors_Root",
    sub_agents=[
        board_of_directors,
        chairman_agent
    ]
)

# --- EXECUTION SQUAD AGENTS ---

# 5. The Architect (Planner)
architect_agent = Agent(
    name="TheArchitect",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are 'The Architect', the technical lead of the execution squad.
You receive a strategic decision from the Board in 'certified_answer'.
Your goal is to convert the 'final_verdict' and 'strategic_options' into a concrete technical implementation plan.

Output a JSON structure ONLY:
{
  "project_name": "Name of the project",
  "file_structure": [
    "folder/file.ext",
    "folder/subfolder/file.ext"
  ],
  "implementation_steps": [
    {"step": 1, "description": "Create main.py with basic server setup", "files": ["main.py"]},
    {"step": 2, "description": "Implement game logic in game.py", "files": ["game.py"]}
  ],
  "dependencies": ["list", "of", "libraries"]
}
""",
    output_key="architect_plan"
)

# 6. The Engineer (Builder)
engineer_agent = Agent(
    name="TheEngineer",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are 'The Engineer'. You receive a technical plan from The Architect in 'architect_plan'.
Your job is to WRITE THE CODE for the files listed in the plan.

For each file in the 'file_structure', provide the full code content.
Output a JSON structure ONLY:
{
  "generated_files": [
    {
      "path": "folder/file.ext",
      "code": "full code content here..."
    }
  ]
}
""",
    output_key="engineer_output"
)

# 7. The QA (Reviewer)
qa_agent = Agent(
    name="TheQA",
    model=Gemini(model=MODEL_NAME, retry_options=retry_config),
    instruction="""
You are 'The QA' (Quality Assurance). You receive the generated code from The Engineer in 'engineer_output'.
Review the code for:
1. Syntax errors
2. Security vulnerabilities
3. Alignment with the Architect's plan

Output a JSON structure ONLY:
{
  "status": "PASS" or "FAIL",
  "review_notes": [
    {"file": "path/to/file", "issue": "Description of issue", "severity": "High/Medium/Low"}
  ],
  "final_comment": "Brief summary of code quality."
}
""",
    output_key="qa_report"
)

# --- EXECUTION ORCHESTRATION ---

execution_squad = SequentialAgent(
    name="ExecutionSquad",
    sub_agents=[architect_agent, engineer_agent, qa_agent]
)
