import math
from typing import Dict, List
from app.core.config import get_settings

settings = get_settings()

class EloSystem:
    def __init__(self, default_rating=None, k_factor=None, home_advantage=None):
        self.default_rating = default_rating or settings.ELO_DEFAULT_RATING
        self.k_factor = k_factor or settings.ELO_K_FACTOR
        self.home_advantage = home_advantage or settings.HOME_ADVANTAGE
        self.ratings: Dict[str, float] = {}
        self.history: Dict[str, List[Dict]] = {}

    def get_rating(self, team: str) -> float:
        return self.ratings.get(team, self.default_rating)

    def set_rating(self, team: str, rating: float):
        self.ratings[team] = rating
        if team not in self.history:
            self.history[team] = []

    def expected_score(self, rating_a: float, rating_b: float) -> float:
        return 1.0 / (1.0 + 10 ** ((rating_b - rating_a) / 400.0))

    def predict_match(self, home_team: str, away_team: str) -> Dict:
        home_rating = self.get_rating(home_team) + self.home_advantage
        away_rating = self.get_rating(away_team)
        home_expected = self.expected_score(home_rating, away_rating)
        draw_factor = 0.26
        home_win_prob = max(0.05, home_expected - draw_factor * (1 - home_expected))
        away_win_prob = max(0.05, (1 - home_expected) - draw_factor * home_expected)
        draw_prob = max(0.05, 1 - home_win_prob - away_win_prob)
        total = home_win_prob + draw_prob + away_win_prob
        home_win_prob /= total
        draw_prob /= total
        away_win_prob /= total
        return {
            "home_elo": round(home_rating, 1),
            "away_elo": round(away_rating, 1),
            "elo_difference": round(home_rating - away_rating, 1),
            "expected_outcome": {
                "home_win": round(home_win_prob * 100, 2),
                "draw": round(draw_prob * 100, 2),
                "away_win": round(away_win_prob * 100, 2),
            },
            "home_rating_raw": round(self.get_rating(home_team), 1),
            "away_rating_raw": round(self.get_rating(away_team), 1),
            "home_advantage_applied": self.home_advantage,
        }

WORLD_CUP_2026_INITIAL_ELO = {
    "Argentina": 2040, "France": 2025, "England": 1990, "Brazil": 1985,
    "Spain": 1975, "Portugal": 1960, "Belgium": 1930, "Netherlands": 1920,
    "Germany": 1910, "Colombia": 1880, "Uruguay": 1870, "Mexico": 1850,
    "Italy": 1840, "USA": 1830, "Croatia": 1820, "Denmark": 1800,
    "Japan": 1790, "Switzerland": 1780, "South Korea": 1770, "Iran": 1750,
    "Serbia": 1740, "Morocco": 1730, "Norway": 1720, "Sweden": 1710,
    "Australia": 1700, "Canada": 1690, "Nigeria": 1680, "Egypt": 1670,
    "Cameroon": 1660, "Ghana": 1650, "Senegal": 1640, "Tunisia": 1630,
    "Ecuador": 1620, "Peru": 1610, "Costa Rica": 1600, "Panama": 1590,
    "Saudi Arabia": 1580, "Qatar": 1570, "New Zealand": 1560, "Iceland": 1550,
}

def create_worldcup_elo_system() -> EloSystem:
    elo = EloSystem()
    for team, rating in WORLD_CUP_2026_INITIAL_ELO.items():
        elo.set_rating(team, rating)
    return elo
