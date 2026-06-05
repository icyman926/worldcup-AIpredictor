from scipy.stats import poisson
from typing import Dict, Tuple
import numpy as np

class PoissonPredictor:
    def __init__(self):
        self.max_goals = 10

    def calculate_expected_goals(self, home_avg: float, away_avg: float, home_conceded: float, away_conceded: float) -> Tuple[float, float]:
        home_expected = (home_avg + away_conceded) / 2
        away_expected = (away_avg + home_conceded) / 2
        return home_expected, away_expected

    def predict_match(self, home_expected: float, away_expected: float) -> Dict:
        home_probs = [poisson.pmf(i, home_expected) for i in range(self.max_goals)]
        away_probs = [poisson.pmf(i, away_expected) for i in range(self.max_goals)]
        home_win = draw = away_win = 0.0
        most_likely_score = (0,0)
        max_prob = 0.0
        for i in range(self.max_goals):
            for j in range(self.max_goals):
                prob = home_probs[i] * away_probs[j]
                if i > j: home_win += prob
                elif i == j: draw += prob
                else: away_win += prob
                if prob > max_prob:
                    max_prob = prob
                    most_likely_score = (i, j)
        total = home_win + draw + away_win
        return {
            "home_expected_goals": round(home_expected, 2),
            "away_expected_goals": round(away_expected, 2),
            "probabilities": {"home_win": round(home_win/total*100,2), "draw": round(draw/total*100,2), "away_win": round(away_win/total*100,2)},
            "most_likely_score": f"{most_likely_score[0]}-{most_likely_score[1]}",
            "score_matrix": self._build_score_matrix(home_probs, away_probs),
        }

    def _build_score_matrix(self, home_probs, away_probs):
        matrix = {}
        for i in range(min(6, self.max_goals)):
            for j in range(min(6, self.max_goals)):
                matrix[f"{i}-{j}"] = round(home_probs[i]*away_probs[j]*100, 1)
        return matrix
