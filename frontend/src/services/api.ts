const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface StrategicOption {
  option: string;
  pros: string;
  cons: string;
  backing_evidence: string;
}

export interface BoardResponse {
  executive_summary: string;
  strategic_options: StrategicOption[];
  risks_to_address: string[];
  final_verdict: string;
  raw_output?: any;
}

export interface QueryRequest {
  query: string;
}

export interface VisualizationResponse {
  image_base64: string;
}

export const api = {
  async runBoard(query: string): Promise<BoardResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/board/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async visualize(boardResponse: BoardResponse): Promise<VisualizationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/board/visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardResponse),
    });

    if (!response.ok) {
      throw new Error(`Visualization Error: ${response.statusText}`);
    }

    return response.json();
  },

  downloadReport: async (response: BoardResponse): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/board/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    });
    if (!res.ok) throw new Error('Failed to generate report');

    // Handle blob download
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `The_Council_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
