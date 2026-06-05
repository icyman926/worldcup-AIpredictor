from typing import Dict, List, Tuple
from .odds_analyzer import OddsAnalyzer
from .poisson_predictor import PoissonPredictor
from .elo_system import EloSystem
from ..models.teams import get_team_by_name, WORLD_CUP_2026_TEAMS
from ..core.config import get_settings

class IntegratedPredictor:
    def __init__(self):
        self.settings = get_settings()
    
    def calculate_qualitative_factor(self, home_team: str, away_team: str) -> float:
        """计算定性因素影响"""
        factors = {
            'morale': 0.0,
            'injury': 0.0,
            'tactics': 0.0,
            'history': 0.0
        }
        
        return sum(factors.values()) / len(factors)
    
    def predict_match(self, home_team: str, away_team: str, 
                      home_odds: float = None, draw_odds: float = None, away_odds: float = None,
                      home_avg_goals: float = 1.5, away_avg_goals: float = 1.3,
                      home_avg_conceded: float = 0.8, away_avg_conceded: float = 0.9) -> Dict:
        """集成多模型进行比赛预测"""
        home_team_data = get_team_by_name(home_team) or {'elo': 1500}
        away_team_data = get_team_by_name(away_team) or {'elo': 1500}
        
        home_elo = home_team_data['elo']
        away_elo = away_team_data['elo']
        
        elo_home, elo_draw, elo_away = EloSystem.predict_match(home_elo, away_elo, self.settings.HOME_ADVANTAGE)
        
        home_attack, home_defense_weak = PoissonPredictor.calculate_expected_goals(home_avg_goals, home_avg_conceded)
        away_attack, away_defense_weak = PoissonPredictor.calculate_expected_goals(away_avg_goals, away_avg_conceded)
        
        poisson_home, poisson_draw, poisson_away, score_probs = PoissonPredictor.calculate_match_probabilities(
            home_attack, home_avg_conceded, away_attack, away_avg_conceded
        )
        
        if home_odds and draw_odds and away_odds:
            odds_home, odds_draw, odds_away = OddsAnalyzer.remove_overround(home_odds, draw_odds, away_odds)
            margin = OddsAnalyzer.calculate_margin(home_odds, draw_odds, away_odds)
            odds_interpretation = OddsAnalyzer.get_odds_interpretation(odds_home, odds_draw, odds_away)
        else:
            odds_home, odds_draw, odds_away = 0.333, 0.334, 0.333
            margin = None
            odds_interpretation = "无赔率数据"
        
        qualitative_factor = self.calculate_qualitative_factor(home_team, away_team)
        
        weights = {
            'odds': self.settings.ODDS_WEIGHT,
            'poisson': self.settings.POISSON_WEIGHT,
            'elo': self.settings.ELO_WEIGHT,
            'qualitative': self.settings.QUALITATIVE_WEIGHT
        }
        
        total_weight = sum(weights.values())
        
        final_home = (weights['odds'] * odds_home + weights['poisson'] * poisson_home + 
                     weights['elo'] * elo_home + weights['qualitative'] * 0.5) / total_weight
        final_draw = (weights['odds'] * odds_draw + weights['poisson'] * poisson_draw + 
                     weights['elo'] * elo_draw + weights['qualitative'] * 0.5) / total_weight
        final_away = (weights['odds'] * odds_away + weights['poisson'] * poisson_away + 
                     weights['elo'] * elo_away + weights['qualitative'] * 0.5) / total_weight
        
        total = final_home + final_draw + final_away
        if total > 0:
            final_home /= total
            final_draw /= total
            final_away /= total
        
        confidence = min(95, 70 + abs(final_home - final_away) * 50)
        
        most_likely_scores = PoissonPredictor.get_most_likely_scores(score_probs, 5)
        
        return {
            'home_team': home_team,
            'away_team': away_team,
            'probabilities': {
                'home': round(final_home * 100, 2),
                'draw': round(final_draw * 100, 2),
                'away': round(final_away * 100, 2)
            },
            'expected_goals': {
                'home': round(home_attack * away_defense_weak, 2),
                'away': round(away_attack * home_defense_weak, 2)
            },
            'confidence': round(confidence, 2),
            'most_likely_scores': [{'score': score, 'probability': round(prob * 100, 2)} for score, prob in most_likely_scores],
            'model_breakdown': {
                'elo': {
                    'home': round(elo_home * 100, 2),
                    'draw': round(elo_draw * 100, 2),
                    'away': round(elo_away * 100, 2)
                },
                'poisson': {
                    'home': round(poisson_home * 100, 2),
                    'draw': round(poisson_draw * 100, 2),
                    'away': round(poisson_away * 100, 2)
                },
                'odds': {
                    'home': round(odds_home * 100, 2),
                    'draw': round(odds_draw * 100, 2),
                    'away': round(odds_away * 100, 2),
                    'margin': round(margin, 2) if margin else None,
                    'interpretation': odds_interpretation
                }
            },
            'team_info': {
                'home': home_team_data,
                'away': away_team_data
            },
            'match_strength': EloSystem.get_match_strength(home_elo, away_elo)
        }
    
    def predict_champion(self) -> List[Dict]:
        """预测冠军概率"""
        predictions = []
        
        for team in WORLD_CUP_2026_TEAMS:
            base_prob = team['elo'] / sum(t['elo'] for t in WORLD_CUP_2026_TEAMS)
            confed_factor = 1.1 if team['confederation'] in ['UEFA', 'CONMEBOL'] else 0.9
            pot_factor = 1.15 if team['pot'] == 1 else 0.95 if team['pot'] == 4 else 1.0
            
            prob = base_prob * confed_factor * pot_factor
            predictions.append({
                'team_id': team['id'],
                'name': team['name'],
                'name_cn': team['name_cn'],
                'flag': team['flag'],
                'probability': round(prob * 100, 2),
                'elo': team['elo'],
                'group': team['group'],
                'pot': team['pot']
            })
        
        predictions.sort(key=lambda x: -x['probability'])
        return predictions[:10]
    
    def predict_group_stage(self, group: str) -> List[Dict]:
        """预测小组出线"""
        group_teams = [t for t in WORLD_CUP_2026_TEAMS if t['group'] == group]
        
        predictions = []
        for team in group_teams:
            team_elo = team['elo']
            avg_opp_elo = sum(t['elo'] for t in group_teams if t['id'] != team['id']) / 3
            diff = team_elo - avg_opp_elo
            
            base_prob = 0.5 + diff / 500
            base_prob = max(0.1, min(0.9, base_prob))
            
            predictions.append({
                'team_id': team['id'],
                'name': team['name'],
                'name_cn': team['name_cn'],
                'flag': team['flag'],
                'elo': team_elo,
                'qualification_prob': round(base_prob * 100, 2),
                'group': group
            })
        
        predictions.sort(key=lambda x: -x['qualification_prob'])
        return predictions
