from pydantic import BaseModel
from typing import Dict, List, Optional

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    home_odds: float
    draw_odds: float
    away_odds: float
    home_avg_goals: float = 1.5
    away_avg_goals: float = 1.3
    home_avg_conceded: float = 0.8
    away_avg_conceded: float = 0.9
