from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "World Cup AI Predictor"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    ELO_DEFAULT_RATING: float = 1500.0
    ELO_K_FACTOR: float = 32.0
    HOME_ADVANTAGE: float = 65.0
    ODDS_WEIGHT: float = 0.40
    POISSON_WEIGHT: float = 0.25
    ELO_WEIGHT: float = 0.20
    CONFIDENCE_THRESHOLD: float = 0.65

    class Config:
        env_file = ".env"

_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
