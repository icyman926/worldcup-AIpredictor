from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.models.schemas import PredictionRequest, PredictionResponse, TeamResponse, ChampionPrediction, GroupPrediction
from app.models.teams import get_all_teams, get_teams_by_group, get_groups, get_team_by_id, get_team_by_name
from app.services.integrated_predictor import IntegratedPredictor

router = APIRouter()

predictor = IntegratedPredictor()

@router.get("/teams", response_model=List[TeamResponse])
def get_teams(group: str = None):
    """获取球队列表，可选按分组筛选"""
    if group:
        teams = get_teams_by_group(group.upper())
    else:
        teams = get_all_teams()
    return teams

@router.get("/teams/{team_id}", response_model=TeamResponse)
def get_team(team_id: str):
    """获取单个球队信息"""
    team = get_team_by_id(team_id.upper())
    if not team:
        team = get_team_by_name(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.get("/groups", response_model=List[str])
def get_groups_list():
    """获取所有分组"""
    return get_groups()

@router.post("/predict/match", response_model=Dict)
def predict_match(request: PredictionRequest):
    """预测单场比赛结果"""
    try:
        result = predictor.predict_match(
            home_team=request.home_team,
            away_team=request.away_team,
            home_odds=request.home_odds,
            draw_odds=request.draw_odds,
            away_odds=request.away_odds,
            home_avg_goals=request.home_avg_goals,
            away_avg_goals=request.away_avg_goals,
            home_avg_conceded=request.home_avg_conceded,
            away_avg_conceded=request.away_avg_conceded
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict/champion", response_model=List[ChampionPrediction])
def predict_champion():
    """预测冠军概率"""
    return predictor.predict_champion()

@router.get("/predict/group/{group}", response_model=List[GroupPrediction])
def predict_group(group: str):
    """预测小组出线"""
    if group.upper() not in get_groups():
        raise HTTPException(status_code=404, detail="Group not found")
    return predictor.predict_group_stage(group.upper())

@router.get("/health")
def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "World Cup AI Predictor API"}
