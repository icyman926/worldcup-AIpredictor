from pydantic import BaseModel
from typing import Dict, List, Optional

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    home_odds: Optional[float] = None
    draw_odds: Optional[float] = None
    away_odds: Optional[float] = None
    home_avg_goals: float = 1.5
    away_avg_goals: float = 1.3
    home_avg_conceded: float = 0.8
    away_avg_conceded: float = 0.9

class TeamResponse(BaseModel):
    id: str
    name: str
    name_cn: str
    flag: str
    confederation: str
    group: str
    elo: float
    pot: int

class ChampionPrediction(BaseModel):
    team_id: str
    name: str
    name_cn: str
    flag: str
    probability: float
    elo: float
    group: str
    pot: int

class GroupPrediction(BaseModel):
    team_id: str
    name: str
    name_cn: str
    flag: str
    elo: float
    qualification_prob: float
    group: str

class PredictionResponse(BaseModel):
    home_team: str
    away_team: str
    probabilities: Dict[str, float]
    expected_goals: Dict[str, float]
    confidence: float
    most_likely_scores: List[Dict[str, float]]
    model_breakdown: Dict[str, Dict]
    team_info: Dict[str, Dict]
    match_strength: str
