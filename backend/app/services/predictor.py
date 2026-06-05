from typing import Dict, List
from app.services.odds_analyzer import OddsAnalyzer
from app.services.poisson_predictor import PoissonPredictor
from app.services.elo_system import create_worldcup_elo_system
from app.core.config import get_settings

settings = get_settings()

class MatchPredictor:
    def __init__(self):
        self.odds_analyzer = OddsAnalyzer()
        self.poisson = PoissonPredictor()
        self.elo = create_worldcup_elo_system()

    def predict(self, home_team, away_team, home_odds, draw_odds, away_odds, home_avg_goals, away_avg_goals, home_avg_conceded, away_avg_conceded) -> Dict:
        odds_result = self.odds_analyzer.calculate_implied_probabilities(home_odds, draw_odds, away_odds)
        home_exp, away_exp = self.poisson.calculate_expected_goals(home_avg_goals, away_avg_goals, home_avg_conceded, away_avg_conceded)
        poisson_result = self.poisson.predict_match(home_exp, away_exp)
        elo_result = self.elo.predict_match(home_team, away_team)
        ensemble = self._ensemble_prediction(odds_result, poisson_result, elo_result)
        confidence = self._calculate_confidence(odds_result, poisson_result, elo_result)
        recommended = self._get_recommendation(ensemble)
        key_factors = self._generate_key_factors(odds_result, poisson_result, elo_result, home_team, away_team)
        return {
            "home_team": home_team, "away_team": away_team,
            "prediction": ensemble, "confidence": confidence,
            "recommended_bet": recommended,
            "odds_analysis": odds_result, "poisson": poisson_result, "elo": elo_result,
            "model_weights": {"odds": settings.ODDS_WEIGHT, "poisson": settings.POISSON_WEIGHT, "elo": settings.ELO_WEIGHT},
            "key_factors": key_factors,
        }

    def _ensemble_prediction(self, odds, poisson, elo) -> Dict:
        w_o, w_p, w_e = settings.ODDS_WEIGHT, settings.POISSON_WEIGHT, settings.ELO_WEIGHT
        total_w = w_o + w_p + w_e
        home = (odds["adjusted_probs"]["home_win"]*w_o + poisson["probabilities"]["home_win"]*w_p + elo["expected_outcome"]["home_win"]*w_e) / total_w
        draw = (odds["adjusted_probs"]["draw"]*w_o + poisson["probabilities"]["draw"]*w_p + elo["expected_outcome"]["draw"]*w_e) / total_w
        away = (odds["adjusted_probs"]["away_win"]*w_o + poisson["probabilities"]["away_win"]*w_p + elo["expected_outcome"]["away_win"]*w_e) / total_w
        total = home + draw + away
        return {"home_win": round(home/total,4), "draw": round(draw/total,4), "away_win": round(away/total,4)}

    def _calculate_confidence(self, odds, poisson, elo) -> float:
        probs = [odds["adjusted_probs"]["home_win"], poisson["probabilities"]["home_win"], elo["expected_outcome"]["home_win"]]
        if max(probs) - min(probs) < 15:
            return 0.9
        elif max(probs) - min(probs) < 30:
            return 0.7
        else:
            return 0.5

    def _get_recommendation(self, prediction) -> str:
        probs = {"Home Win": prediction["home_win"], "Draw": prediction["draw"], "Away Win": prediction["away_win"]}
        return max(probs, key=probs.get)

    def _generate_key_factors(self, odds, poisson, elo, home, away) -> List[str]:
        factors = []
        if odds["overround"] > 10:
            factors.append(f"High bookmaker margin ({odds['overround']}%) suggests market uncertainty")
        diff = elo["elo_difference"]
        if abs(diff) > 200:
            stronger = home if diff > 0 else away
            factors.append(f"Significant Elo rating gap ({diff:+.0f} pts) favors {stronger}")
        if poisson["home_expected_goals"] > 2.0:
            factors.append(f"High expected goals for {home} ({poisson['home_expected_goals']})")
        if not factors:
            factors.append("Models show moderate agreement - consider as informational only")
        return factors
