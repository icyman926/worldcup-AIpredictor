from typing import Dict, Tuple

class EloSystem:
    @staticmethod
    def calculate_expected_score(rating_a: float, rating_b: float) -> float:
        """计算预期得分"""
        return 1.0 / (1.0 + 10.0 ** ((rating_b - rating_a) / 400.0))

    @staticmethod
    def update_rating(old_rating: float, expected_score: float, actual_score: float, k_factor: float = 32) -> float:
        """更新Elo评级"""
        return old_rating + k_factor * (actual_score - expected_score)

    @staticmethod
    def predict_match(home_rating: float, away_rating: float, home_advantage: float = 65.0) -> Tuple[float, float, float]:
        """预测比赛结果概率"""
        adjusted_home_rating = home_rating + home_advantage
        home_expected = EloSystem.calculate_expected_score(adjusted_home_rating, away_rating)
        away_expected = 1.0 - home_expected
        
        draw_prob = min(0.35, max(0.2, 0.5 - abs(home_expected - 0.5) * 0.8))
        
        remaining = 1.0 - draw_prob
        home_win = home_expected * remaining
        away_win = away_expected * remaining
        
        return home_win, draw_prob, away_win

    @staticmethod
    def get_rating_difference(rating_a: float, rating_b: float) -> float:
        """计算评级差距"""
        return abs(rating_a - rating_b)

    @staticmethod
    def get_match_strength(rating_a: float, rating_b: float) -> str:
        """判断比赛强度级别"""
        diff = EloSystem.get_rating_difference(rating_a, rating_b)
        
        if diff < 50:
            return "势均力敌"
        elif diff < 100:
            return "轻微优势"
        elif diff < 150:
            return "明显优势"
        elif diff < 200:
            return "较大优势"
        else:
            return "碾压优势"
