from typing import Dict, List, Tuple
import math

class PoissonPredictor:
    @staticmethod
    def poisson_probability(lmbda: float, k: int) -> float:
        """计算泊松概率 P(k; λ)"""
        return (math.exp(-lmbda) * (lmbda ** k)) / math.factorial(k)

    @staticmethod
    def calculate_goals_probabilities(attack_strength: float, defense_weakness: float, max_goals: int = 5) -> List[float]:
        """计算一支球队进球数的概率分布"""
        expected_goals = attack_strength * defense_weakness
        probabilities = []
        
        for k in range(max_goals + 1):
            prob = PoissonPredictor.poisson_probability(expected_goals, k)
            probabilities.append(prob)
        
        remaining = 1.0 - sum(probabilities)
        if remaining > 0:
            probabilities[-1] += remaining
        
        return probabilities

    @staticmethod
    def calculate_match_probabilities(home_attack: float, home_defense: float, 
                                      away_attack: float, away_defense: float,
                                      max_goals: int = 5) -> Tuple[float, float, float, Dict[str, float]]:
        """计算比赛结果概率和比分概率"""
        home_probs = PoissonPredictor.calculate_goals_probabilities(home_attack, away_defense, max_goals)
        away_probs = PoissonPredictor.calculate_goals_probabilities(away_attack, home_defense, max_goals)
        
        home_win = 0.0
        draw = 0.0
        away_win = 0.0
        score_probs = {}
        
        for h in range(max_goals + 1):
            for a in range(max_goals + 1):
                prob = home_probs[h] * away_probs[a]
                score_probs[f"{h}-{a}"] = prob
                
                if h > a:
                    home_win += prob
                elif h == a:
                    draw += prob
                else:
                    away_win += prob
        
        return home_win, draw, away_win, score_probs

    @staticmethod
    def get_most_likely_scores(score_probs: Dict[str, float], top_n: int = 5) -> List[Tuple[str, float]]:
        """获取最可能的比分"""
        sorted_scores = sorted(score_probs.items(), key=lambda x: -x[1])
        return [(score, prob) for score, prob in sorted_scores[:top_n]]

    @staticmethod
    def calculate_expected_goals(avg_goals: float, avg_conceded: float, league_avg: float = 2.7) -> Tuple[float, float]:
        """计算进攻强度和防守弱点"""
        attack_strength = avg_goals / league_avg
        defense_weakness = avg_conceded / league_avg
        return attack_strength, defense_weakness
