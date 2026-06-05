from typing import Dict, List, Tuple
import numpy as np

class OddsAnalyzer:
    @staticmethod
    def calculate_implied_probability(odds: float) -> float:
        """计算隐含概率"""
        if odds <= 1.0:
            return 0.0
        return 1.0 / odds

    @staticmethod
    def remove_overround(home_odds: float, draw_odds: float, away_odds: float) -> Tuple[float, float, float]:
        """去除博彩公司利润率，计算真实概率"""
        home_implied = OddsAnalyzer.calculate_implied_probability(home_odds)
        draw_implied = OddsAnalyzer.calculate_implied_probability(draw_odds)
        away_implied = OddsAnalyzer.calculate_implied_probability(away_odds)
        
        total = home_implied + draw_implied + away_implied
        
        if total == 0:
            return 0.333, 0.333, 0.334
        
        home_prob = home_implied / total
        draw_prob = draw_implied / total
        away_prob = away_implied / total
        
        return home_prob, draw_prob, away_prob

    @staticmethod
    def calculate_margin(home_odds: float, draw_odds: float, away_odds: float) -> float:
        """计算赔率水漂（博彩公司利润率）"""
        home_implied = OddsAnalyzer.calculate_implied_probability(home_odds)
        draw_implied = OddsAnalyzer.calculate_implied_probability(draw_odds)
        away_implied = OddsAnalyzer.calculate_implied_probability(away_odds)
        
        total = home_implied + draw_implied + away_implied
        return (total - 1.0) * 100

    @staticmethod
    def analyze_odds_movement(initial_odds: Dict[str, float], current_odds: Dict[str, float]) -> Dict[str, str]:
        """分析赔率变动方向，判断资本流向"""
        result = {}
        
        for key in ['home', 'draw', 'away']:
            if current_odds[key] < initial_odds[key]:
                result[key] = 'decrease'
            elif current_odds[key] > initial_odds[key]:
                result[key] = 'increase'
            else:
                result[key] = 'stable'
        
        return result

    @staticmethod
    def analyze_cross_company_odds(odds_list: List[Dict[str, float]]) -> Dict[str, float]:
        """分析多家博彩公司的赔率差异"""
        if len(odds_list) < 2:
            return {'home_std': 0, 'draw_std': 0, 'away_std': 0, 'consensus': 'high'}
        
        home_odds = [o['home'] for o in odds_list]
        draw_odds = [o['draw'] for o in odds_list]
        away_odds = [o['away'] for o in odds_list]
        
        home_std = np.std(home_odds)
        draw_std = np.std(draw_odds)
        away_std = np.std(away_odds)
        
        avg_std = (home_std + draw_std + away_std) / 3
        
        consensus = 'high' if avg_std < 0.15 else 'medium' if avg_std < 0.3 else 'low'
        
        return {
            'home_std': round(home_std, 4),
            'draw_std': round(draw_std, 4),
            'away_std': round(away_std, 4),
            'consensus': consensus
        }

    @staticmethod
    def calculate_asians_handicap_probability(handicap: float, odds: float) -> float:
        """计算亚洲盘口隐含概率"""
        base_prob = OddsAnalyzer.calculate_implied_probability(odds)
        adjustment = abs(handicap) * 0.08
        return min(0.95, max(0.05, base_prob - adjustment if handicap > 0 else base_prob + adjustment))

    @staticmethod
    def get_odds_interpretation(home_prob: float, draw_prob: float, away_prob: float) -> str:
        """生成赔率解读文字"""
        max_prob = max(home_prob, draw_prob, away_prob)
        
        if max_prob >= 0.6:
            return "赔率强烈倾向"
        elif max_prob >= 0.5:
            return "赔率略微倾向"
        else:
            return "赔率较为均衡"
