from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QueryRequest(BaseModel):
    query: str

class StrategicOption(BaseModel):
    option: str
    pros: str
    cons: str
    backing_evidence: str

class BoardResponse(BaseModel):
    executive_summary: str
    strategic_options: List[StrategicOption]
    risks_to_address: List[str]
    final_verdict: str
    raw_output: Optional[Dict[str, Any]] = None
