from typing import Dict, Tuple
import math

class OddsAnalyzer:
    def __init__(self):
        self.market_consensus = 0.0

    def calculate_implied_probabilities(self, home_odds: float, draw_odds: float, away_odds: float) -> Dict:
        home_prob = 1.0 / home_odds
        draw_prob = 1.0 / draw_odds
        away_prob = 1.0 / away_odds
        total = home_prob + draw_prob + away_prob
        overround = (total - 1.0) * 100
        adjusted_home = (home_prob / total) * 100
        adjusted_draw = (draw_prob / total) * 100
        adjusted_away = (away_prob / total) * 100
        self.market_consensus = max(adjusted_home, adjusted_draw, adjusted_away) / 100
        return {
            "raw_probabilities": {"home_win": round(home_prob*100,2), "draw": round(draw_prob*100,2), "away_win": round(away_prob*100,2)},
            "adjusted_probs": {"home_win": round(adjusted_home,2), "draw": round(adjusted_draw,2), "away_win": round(adjusted_away,2)},
            "overround": round(overround, 2),
            "market_consensus": self.market_consensus,
        }

    def find_value_bets(self, odds: float, model_prob: float) -> Dict:
        implied_prob = 1.0 / odds
        edge = model_prob - implied_prob
        if edge > 0.05:
            assessment = "Strong Value"
        elif edge > 0.02:
            assessment = "Moderate Value"
        else:
            assessment = "No Value"
        return {"edge": round(edge*100,2), "assessment": assessment, "implied_prob": round(implied_prob*100,2)}
