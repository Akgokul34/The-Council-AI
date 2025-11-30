import networkx as nx
import matplotlib.pyplot as plt
import io
import base64
from google.adk.tools import FunctionTool

# --- TOOLS ---

def novelty_score_tool(evidence_list: list) -> dict:
    if not evidence_list:
        return {"novelty_score": 0.98, "reason": "No evidence found"}
    hits = len([e for e in evidence_list if e.get("snippet")])
    score = max(0.0, 1.0 - min(hits / 40.0, 0.9))
    return {"novelty_score": round(score, 3), "num_hits": hits}

novelty_tool = FunctionTool(novelty_score_tool)

def simulate_outcomes(params: dict) -> dict:
    """Placeholder Monte Carlo simulator."""
    return {"mean": 1.5, "std": 0.1, "iterations": 200, "sample_outcome": [1.4, 1.6, 1.5]}

simulator_tool = FunctionTool(simulate_outcomes)

# --- VISUALIZATION ---

def generate_decision_graph(certified_json: dict) -> str:
    """
    Generates a base64 encoded image of the decision graph.
    """
    if not certified_json:
        return ""

    G = nx.DiGraph()
    G.add_node("Query", pos=(0, 0), color='white', size=4000)
    
    # Parallel Agents
    G.add_node("Analyst (Facts)", pos=(-2, -1), color='lightblue', size=2500)
    G.add_node("Visionary (Ideas)", pos=(0, -1), color='lightgreen', size=2500)
    G.add_node("Risk Officer (Threats)", pos=(2, -1), color='salmon', size=2500)
    
    G.add_edge("Query", "Analyst (Facts)", label="Delegates")
    G.add_edge("Query", "Visionary (Ideas)", label="Delegates")
    G.add_edge("Query", "Risk Officer (Threats)", label="Delegates")
    
    # Final Synthesis
    G.add_node("The Chairman (Verdict)", pos=(0, -3), color='gold', size=5000)
    G.add_edge("Analyst (Facts)", "The Chairman (Verdict)", label="Data")
    G.add_edge("Visionary (Ideas)", "The Chairman (Verdict)", label="Concepts")
    G.add_edge("Risk Officer (Threats)", "The Chairman (Verdict)", label="Warnings")

    # Draw
    pos_map = nx.get_node_attributes(G, 'pos')
    colors = [G.nodes[node]['color'] for node in G.nodes()]
    sizes = [G.nodes[node]['size'] for node in G.nodes()]
    
    plt.figure(figsize=(12, 8))
    nx.draw(G, pos_map, with_labels=True, node_color=colors, node_size=sizes, font_size=10, edge_color='gray', arrows=True, arrowsize=20)
    plt.title("Board of Directors: Multi-Perspective Architecture")
    
    verdict = certified_json.get('final_verdict', 'N/A')
    if len(verdict) > 100:
        verdict = verdict[:100] + "..."
        
    plt.text(0, -4.5, f"Verdict: {verdict}", horizontalalignment='center', fontsize=12, bbox=dict(facecolor='yellow', alpha=0.5))
    plt.axis('off')
    
    # Save to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    
    # Encode to base64
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return img_str
