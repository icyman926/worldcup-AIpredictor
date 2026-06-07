from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import asyncio
import httpx
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="World Cup AI Predictor API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ODDS_API_KEY = os.getenv("ODDS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class MatchInput(BaseModel):
    home_team: str
    away_team: str
    venue: Optional[str] = "neutral"
    date: Optional[str] = None

class OddsData(BaseModel):
    home_odds: float
    draw_odds: float
    away_odds: float
    margin: float
    interpretation: str

class PredictionResult(BaseModel):
    home_team: str
    away_team: str
    probabilities: Dict[str, float]
    expected_goals: Dict[str, float]
    confidence: float
    most_likely_scores: List[Dict[str, float]]
    model_breakdown: Dict[str, Dict[str, Any]]
    odds_analysis: Optional[OddsData]
    key_factors: List[str]

@app.get("/")
async def root():
    return {"message": "World Cup AI Predictor API - Multi-dimensional Football Prediction System"}

@app.post("/api/predict/match", response_model=PredictionResult)
async def predict_match(input: MatchInput):
    try:
        odds_data = await fetch_odds(input.home_team, input.away_team)
        prediction = await generate_prediction(input, odds_data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/odds/{home_team}/{away_team}")
async def get_odds(home_team: str, away_team: str):
    try:
        odds_data = await fetch_odds(home_team, away_team)
        return odds_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/{team}")
async def get_team_news(team: str):
    try:
        news = await fetch_team_news(team)
        return news
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def fetch_odds(home_team: str, away_team: str) -> Optional[OddsData]:
    if not ODDS_API_KEY:
        return None
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds",
                params={
                    "apiKey": ODDS_API_KEY,
                    "regions": "us,uk,eu",
                    "markets": "h2h",
                    "oddsFormat": "decimal"
                },
                timeout=30
            )
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            for match in data:
                home = match.get("home_team", "")
                away = match.get("away_team", "")
                
                if (home.lower() == home_team.lower() and away.lower() == away_team.lower()) or \
                   (home.lower() == away_team.lower() and away.lower() == home_team.lower()):
                    
                    bookmakers = match.get("bookmakers", [])
                    if bookmakers:
                        markets = bookmakers[0].get("markets", [])
                        if markets:
                            outcomes = markets[0].get("outcomes", [])
                            if len(outcomes) >= 3:
                                home_odds = outcomes[0]["price"]
                                away_odds = outcomes[1]["price"]
                                draw_odds = outcomes[2]["price"]
                                
                                implied_home = 1 / home_odds
                                implied_draw = 1 / draw_odds
                                implied_away = 1 / away_odds
                                total = implied_home + implied_draw + implied_away
                                margin = (total - 1) * 100
                                
                                max_prob = max(implied_home, implied_draw, implied_away)
                                interpretation = "Balanced"
                                if max_prob >= 0.45:
                                    interpretation = "Favoring " + ("home" if implied_home == max_prob else "draw" if implied_draw == max_prob else "away")
                                
                                return OddsData(
                                    home_odds=home_odds,
                                    draw_odds=draw_odds,
                                    away_odds=away_odds,
                                    margin=round(margin, 2),
                                    interpretation=interpretation
                                )
            return None
    except:
        return None

async def fetch_team_news(team: str) -> Dict[str, Any]:
    if not GEMINI_API_KEY:
        return {"message": "Gemini API key not configured"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"Get latest news and updates about {team} national football team. Focus on: 1) Player injuries and fitness status, 2) Team morale and dressing room atmosphere, 3) Recent form and performance, 4) Key player updates. Return in JSON format with fields: status, summary, key_points."
                        }]
                    }]
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                try:
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"status": "success", "news": text}
                except:
                    return {"status": "success", "news": "No structured news available"}
            return {"status": "error", "message": "Failed to fetch news"}
    except:
        return {"status": "error", "message": "Failed to fetch news"}

async def generate_prediction(input: MatchInput, odds_data: Optional[OddsData]) -> PredictionResult:
    home_team = input.home_team
    away_team = input.away_team
    
    TEAM_ELO = {
        "Brazil": 2027, "France": 2015, "Spain": 1995, "Argentina": 1980,
        "England": 1975, "Belgium": 1955, "Germany": 1940, "Netherlands": 1935,
        "Portugal": 1925, "Uruguay": 1910, "Croatia": 1895, "Switzerland": 1905,
        "Mexico": 1865, "United States": 1870, "South Korea": 1825, "Japan": 1830,
        "Morocco": 1810, "Senegal": 1800, "Iran": 1805, "Serbia": 1850,
        "Denmark": 1860, "Austria": 1855, "Turkey": 1855, "Colombia": 1855,
        "Sweden": 1845, "Czech Republic": 1830, "Norway": 1850, "Scotland": 1820,
        "Australia": 1775, "Canada": 1790, "Paraguay": 1785, "Egypt": 1790,
        "Nigeria": 1785, "Cote d'Ivoire": 1795, "Ecuador": 1785, "Algeria": 1780,
        "Tunisia": 1770, "South Africa": 1760, "Ghana": 1765, "Cape Verde": 1765,
        "Saudi Arabia": 1755, "Iraq": 1775, "Jordan": 1760, "Panama": 1740,
        "Curacao": 1740, "Haiti": 1755, "New Zealand": 1750, "Bosnia and Herzegovina": 1800,
        "Qatar": 1785, "DR Congo": 1775, "Uzbekistan": 1780
    }
    
    home_elo = TEAM_ELO.get(home_team, 1800)
    away_elo = TEAM_ELO.get(away_team, 1800)
    
    venue_factor = 1.0
    if input.venue == "home":
        home_elo = home_elo * 1.1
        away_elo = away_elo * 0.9
    elif input.venue == "away":
        home_elo = home_elo * 0.9
        away_elo = away_elo * 1.1
    
    expected_home = 1 / (1 + 10 ** ((away_elo - home_elo) / 400))
    expected_away = 1 - expected_home
    draw_prob = max(0.25, min(0.38, 0.5 - abs(expected_home - 0.5) * 0.6))
    
    elo_home = (expected_home * (1 - draw_prob)) * 100
    elo_draw = draw_prob * 100
    elo_away = (expected_away * (1 - draw_prob)) * 100
    
    home_attack = 1.5 + (home_elo - 1800) / 200
    away_attack = 1.5 + (away_elo - 1800) / 200
    home_defense = 1.0 - (home_elo - 1800) / 400
    away_defense = 1.0 - (away_elo - 1800) / 400
    
    lambda_home = home_attack * away_defense
    lambda_away = away_attack * home_defense
    
    def poisson(k, lam):
        return (lam ** k) * (2.71828 ** (-lam)) / (1 if k == 0 else k * poisson(k-1, lam)[0] if k > 0 else 1)
    
    scores = {}
    home_win = 0
    draw = 0
    away_win = 0
    
    for h in range(0, 6):
        for a in range(0, 6):
            prob_h = (lambda_home ** h) * (2.71828 ** (-lambda_home))
            prob_a = (lambda_away ** a) * (2.71828 ** (-lambda_away))
            for i in range(1, h): prob_h /= i
            for i in range(1, a): prob_a /= i
            prob = prob_h * prob_a
            scores[f"{h}-{a}"] = prob
            if h > a:
                home_win += prob
            elif h == a:
                draw += prob
            else:
                away_win += prob
    
    poisson_home = home_win * 100
    poisson_draw = draw * 100
    poisson_away = away_win * 100
    
    if odds_data:
        implied_home = 1 / odds_data.home_odds
        implied_draw = 1 / odds_data.draw_odds
        implied_away = 1 / odds_data.away_odds
        total = implied_home + implied_draw + implied_away
        odds_home = (implied_home / total) * 100
        odds_draw = (implied_draw / total) * 100
        odds_away = (implied_away / total) * 100
    else:
        odds_home = 33.33
        odds_draw = 33.34
        odds_away = 33.33
    
    weights = {
        "elo": 0.25,
        "poisson": 0.30,
        "odds": 0.35,
        "qualitative": 0.10
    }
    
    final_home = (weights["elo"] * elo_home + weights["poisson"] * poisson_home + 
                  weights["odds"] * odds_home + weights["qualitative"] * 50)
    final_draw = (weights["elo"] * elo_draw + weights["poisson"] * poisson_draw + 
                  weights["odds"] * odds_draw + weights["qualitative"] * 50)
    final_away = (weights["elo"] * elo_away + weights["poisson"] * poisson_away + 
                  weights["odds"] * odds_away + weights["qualitative"] * 50)
    
    total = final_home + final_draw + final_away
    final_home = (final_home / total) * 100
    final_draw = (final_draw / total) * 100
    final_away = (final_away / total) * 100
    
    sorted_scores = sorted(scores.items(), key=lambda x: -x[1])[:5]
    most_likely_scores = [{"score": s[0], "probability": round(s[1] * 100, 2)} for s in sorted_scores]
    
    confidence = min(95, 65 + abs(final_home - final_away) * 0.4 + (100 - odds_data.margin if odds_data else 5))
    
    key_factors = []
    if abs(final_home - final_away) > 15:
        key_factors.append("Team strength difference is significant")
    if input.venue != "neutral":
        key_factors.append(f"{home_team if input.venue == 'home' else away_team} has home advantage")
    if odds_data and odds_data.margin < 5:
        key_factors.append("Odds market shows high confidence")
    if home_elo > away_elo + 100:
        key_factors.append(f"{home_team} significantly higher rated")
    
    return PredictionResult(
        home_team=home_team,
        away_team=away_team,
        probabilities={
            "home": round(final_home, 2),
            "draw": round(final_draw, 2),
            "away": round(final_away, 2)
        },
        expected_goals={
            "home": round(lambda_home, 2),
            "away": round(lambda_away, 2)
        },
        confidence=round(confidence, 2),
        most_likely_scores=most_likely_scores,
        model_breakdown={
            "elo": {"home": round(elo_home, 2), "draw": round(elo_draw, 2), "away": round(elo_away, 2)},
            "poisson": {"home": round(poisson_home, 2), "draw": round(poisson_draw, 2), "away": round(poisson_away, 2)},
            "odds": {"home": round(odds_home, 2), "draw": round(odds_draw, 2), "away": round(odds_away, 2),
                     "margin": odds_data.margin if odds_data else None, "interpretation": odds_data.interpretation if odds_data else "No odds data"}
        },
        odds_analysis=odds_data,
        key_factors=key_factors
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
