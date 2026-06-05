const WORLD_CUP_2026_TEAMS = [
  { id: 'BRA', name: 'Brazil', name_cn: '巴西', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'A', elo: 2027, pot: 1 },
  { id: 'GER', name: 'Germany', name_cn: '德国', flag: '🇩🇪', confederation: 'UEFA', group: 'A', elo: 1940, pot: 2 },
  { id: 'USA', name: 'United States', name_cn: '美国', flag: '🇺🇸', confederation: 'CONCACAF', group: 'A', elo: 1870, pot: 3 },
  { id: 'JPN', name: 'Japan', name_cn: '日本', flag: '🇯🇵', confederation: 'AFC', group: 'A', elo: 1830, pot: 4 },
  { id: 'FRA', name: 'France', name_cn: '法国', flag: '🇫🇷', confederation: 'UEFA', group: 'B', elo: 2015, pot: 1 },
  { id: 'ARG', name: 'Argentina', name_cn: '阿根廷', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'B', elo: 1980, pot: 2 },
  { id: 'MEX', name: 'Mexico', name_cn: '墨西哥', flag: '🇲🇽', confederation: 'CONCACAF', group: 'B', elo: 1865, pot: 3 },
  { id: 'NGA', name: 'Nigeria', name_cn: '尼日利亚', flag: '🇳🇬', confederation: 'CAF', group: 'B', elo: 1780, pot: 4 },
  { id: 'ESP', name: 'Spain', name_cn: '西班牙', flag: '🇪🇸', confederation: 'UEFA', group: 'C', elo: 1995, pot: 1 },
  { id: 'POR', name: 'Portugal', name_cn: '葡萄牙', flag: '🇵🇹', confederation: 'UEFA', group: 'C', elo: 1925, pot: 2 },
  { id: 'CRC', name: 'Costa Rica', name_cn: '哥斯达黎加', flag: '🇨🇷', confederation: 'CONCACAF', group: 'C', elo: 1800, pot: 3 },
  { id: 'KOR', name: 'South Korea', name_cn: '韩国', flag: '🇰🇷', confederation: 'AFC', group: 'C', elo: 1825, pot: 4 },
  { id: 'BEL', name: 'Belgium', name_cn: '比利时', flag: '🇧🇪', confederation: 'UEFA', group: 'D', elo: 1955, pot: 1 },
  { id: 'NED', name: 'Netherlands', name_cn: '荷兰', flag: '🇳🇱', confederation: 'UEFA', group: 'D', elo: 1935, pot: 2 },
  { id: 'CAN', name: 'Canada', name_cn: '加拿大', flag: '🇨🇦', confederation: 'CONCACAF', group: 'D', elo: 1790, pot: 3 },
  { id: 'MAR', name: 'Morocco', name_cn: '摩洛哥', flag: '🇲🇦', confederation: 'CAF', group: 'D', elo: 1810, pot: 4 },
  { id: 'ENG', name: 'England', name_cn: '英格兰', flag: '🏴', confederation: 'UEFA', group: 'E', elo: 1975, pot: 1 },
  { id: 'SUI', name: 'Switzerland', name_cn: '瑞士', flag: '🇨🇭', confederation: 'UEFA', group: 'E', elo: 1905, pot: 2 },
  { id: 'ECU', name: 'Ecuador', name_cn: '厄瓜多尔', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E', elo: 1785, pot: 3 },
  { id: 'AUS', name: 'Australia', name_cn: '澳大利亚', flag: '🇦🇺', confederation: 'AFC', group: 'E', elo: 1775, pot: 4 },
  { id: 'ITA', name: 'Italy', name_cn: '意大利', flag: '🇮🇹', confederation: 'UEFA', group: 'F', elo: 1960, pot: 1 },
  { id: 'CRO', name: 'Croatia', name_cn: '克罗地亚', flag: '🇭🇷', confederation: 'UEFA', group: 'F', elo: 1895, pot: 2 },
  { id: 'COL', name: 'Colombia', name_cn: '哥伦比亚', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'F', elo: 1855, pot: 3 },
  { id: 'GHA', name: 'Ghana', name_cn: '加纳', flag: '🇬🇭', confederation: 'CAF', group: 'F', elo: 1765, pot: 4 },
  { id: 'URU', name: 'Uruguay', name_cn: '乌拉圭', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'G', elo: 1910, pot: 1 },
  { id: 'DEN', name: 'Denmark', name_cn: '丹麦', flag: '🇩🇰', confederation: 'UEFA', group: 'G', elo: 1885, pot: 2 },
  { id: 'IRN', name: 'Iran', name_cn: '伊朗', flag: '🇮🇷', confederation: 'AFC', group: 'G', elo: 1805, pot: 3 },
  { id: 'SAU', name: 'Saudi Arabia', name_cn: '沙特阿拉伯', flag: '🇸🇦', confederation: 'AFC', group: 'G', elo: 1755, pot: 4 },
  { id: 'SWE', name: 'Sweden', name_cn: '瑞典', flag: '🇸🇪', confederation: 'UEFA', group: 'H', elo: 1845, pot: 1 },
  { id: 'TUN', name: 'Tunisia', name_cn: '突尼斯', flag: '🇹🇳', confederation: 'CAF', group: 'H', elo: 1770, pot: 4 },
  { id: 'VEN', name: 'Venezuela', name_cn: '委内瑞拉', flag: '🇻🇪', confederation: 'CONMEBOL', group: 'H', elo: 1760, pot: 3 },
  { id: 'UKR', name: 'Ukraine', name_cn: '乌克兰', flag: '🇺🇦', confederation: 'UEFA', group: 'H', elo: 1880, pot: 2 },
  { id: 'CZE', name: 'Czech Republic', name_cn: '捷克', flag: '🇨🇿', confederation: 'UEFA', group: 'I', elo: 1830, pot: 1 },
  { id: 'ALG', name: 'Algeria', name_cn: '阿尔及利亚', flag: '🇩🇿', confederation: 'CAF', group: 'I', elo: 1780, pot: 4 },
  { id: 'HON', name: 'Honduras', name_cn: '洪都拉斯', flag: '🇭🇳', confederation: 'CONCACAF', group: 'I', elo: 1750, pot: 3 },
  { id: 'ISR', name: 'Israel', name_cn: '以色列', flag: '🇮🇱', confederation: 'UEFA', group: 'I', elo: 1820, pot: 2 },
  { id: 'NOR', name: 'Norway', name_cn: '挪威', flag: '🇳🇴', confederation: 'UEFA', group: 'J', elo: 1850, pot: 1 },
  { id: 'SEN', name: 'Senegal', name_cn: '塞内加尔', flag: '🇸🇳', confederation: 'CAF', group: 'J', elo: 1800, pot: 4 },
  { id: 'PER', name: 'Peru', name_cn: '秘鲁', flag: '🇵🇪', confederation: 'CONMEBOL', group: 'J', elo: 1795, pot: 3 },
  { id: 'CHL', name: 'Chile', name_cn: '智利', flag: '🇨🇱', confederation: 'CONMEBOL', group: 'J', elo: 1835, pot: 2 },
  { id: 'AUT', name: 'Austria', name_cn: '奥地利', flag: '🇦🇹', confederation: 'UEFA', group: 'K', elo: 1855, pot: 1 },
  { id: 'EGY', name: 'Egypt', name_cn: '埃及', flag: '🇪🇬', confederation: 'CAF', group: 'K', elo: 1790, pot: 4 },
  { id: 'PAN', name: 'Panama', name_cn: '巴拿马', flag: '🇵🇦', confederation: 'CONCACAF', group: 'K', elo: 1740, pot: 3 },
  { id: 'GRE', name: 'Greece', name_cn: '希腊', flag: '🇬🇷', confederation: 'UEFA', group: 'K', elo: 1825, pot: 2 },
  { id: 'POL', name: 'Poland', name_cn: '波兰', flag: '🇵🇱', confederation: 'UEFA', group: 'L', elo: 1860, pot: 1 },
  { id: 'MAD', name: 'Madagascar', name_cn: '马达加斯加', flag: '🇲🇬', confederation: 'CAF', group: 'L', elo: 1745, pot: 4 },
  { id: 'RUS', name: 'Russia', name_cn: '俄罗斯', flag: '🇷🇺', confederation: 'UEFA', group: 'L', elo: 1815, pot: 3 },
  { id: 'PAR', name: 'Paraguay', name_cn: '巴拉圭', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'L', elo: 1785, pot: 2 },
];

function getTeamByName(name) {
  return WORLD_CUP_2026_TEAMS.find(t => t.name.toLowerCase() === name.toLowerCase());
}

class OddsAnalyzer {
  static calculateImpliedProbability(odds) {
    if (odds <= 1.0) return 0.0;
    return 1.0 / odds;
  }

  static removeOverround(homeOdds, drawOdds, awayOdds) {
    const homeImplied = OddsAnalyzer.calculateImpliedProbability(homeOdds);
    const drawImplied = OddsAnalyzer.calculateImpliedProbability(drawOdds);
    const awayImplied = OddsAnalyzer.calculateImpliedProbability(awayOdds);
    
    const total = homeImplied + drawImplied + awayImplied;
    if (total === 0) return [0.333, 0.333, 0.334];
    
    return [homeImplied / total, drawImplied / total, awayImplied / total];
  }

  static calculateMargin(homeOdds, drawOdds, awayOdds) {
    const homeImplied = OddsAnalyzer.calculateImpliedProbability(homeOdds);
    const drawImplied = OddsAnalyzer.calculateImpliedProbability(drawOdds);
    const awayImplied = OddsAnalyzer.calculateImpliedProbability(awayOdds);
    return (homeImplied + drawImplied + awayImplied - 1.0) * 100;
  }

  static getOddsInterpretation(homeProb, drawProb, awayProb) {
    const maxProb = Math.max(homeProb, drawProb, awayProb);
    if (maxProb >= 0.6) return "赔率强烈倾向";
    if (maxProb >= 0.5) return "赔率略微倾向";
    return "赔率较为均衡";
  }
}

class PoissonPredictor {
  static poissonProbability(lambda, k) {
    return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
  }

  static factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  static calculateGoalsProbabilities(attackStrength, defenseWeakness, maxGoals = 5) {
    const expectedGoals = attackStrength * defenseWeakness;
    const probabilities = [];
    
    for (let k = 0; k <= maxGoals; k++) {
      probabilities.push(this.poissonProbability(expectedGoals, k));
    }
    
    const remaining = 1.0 - probabilities.reduce((a, b) => a + b, 0);
    if (remaining > 0) probabilities[maxGoals] += remaining;
    
    return probabilities;
  }

  static calculateMatchProbabilities(homeAttack, homeDefense, awayAttack, awayDefense, maxGoals = 5) {
    const homeProbs = this.calculateGoalsProbabilities(homeAttack, awayDefense, maxGoals);
    const awayProbs = this.calculateGoalsProbabilities(awayAttack, homeDefense, maxGoals);
    
    let homeWin = 0, draw = 0, awayWin = 0;
    const scoreProbs = {};
    
    for (let h = 0; h <= maxGoals; h++) {
      for (let a = 0; a <= maxGoals; a++) {
        const prob = homeProbs[h] * awayProbs[a];
        scoreProbs[`${h}-${a}`] = prob;
        if (h > a) homeWin += prob;
        else if (h === a) draw += prob;
        else awayWin += prob;
      }
    }
    
    return { homeWin, draw, awayWin, scoreProbs };
  }

  static getMostLikelyScores(scoreProbs, topN = 5) {
    return Object.entries(scoreProbs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
  }

  static calculateExpectedGoals(avgGoals, avgConceded, leagueAvg = 2.7) {
    return {
      attackStrength: avgGoals / leagueAvg,
      defenseWeakness: avgConceded / leagueAvg
    };
  }
}

class EloSystem {
  static calculateExpectedScore(ratingA, ratingB) {
    return 1.0 / (1.0 + Math.pow(10, (ratingB - ratingA) / 400.0));
  }

  static predictMatch(homeRating, awayRating, homeAdvantage = 65.0) {
    const adjustedHomeRating = homeRating + homeAdvantage;
    const homeExpected = this.calculateExpectedScore(adjustedHomeRating, awayRating);
    const awayExpected = 1.0 - homeExpected;
    
    const drawProb = Math.min(0.35, Math.max(0.2, 0.5 - Math.abs(homeExpected - 0.5) * 0.8));
    const remaining = 1.0 - drawProb;
    
    return {
      homeWin: homeExpected * remaining,
      draw: drawProb,
      awayWin: awayExpected * remaining
    };
  }

  static getMatchStrength(ratingA, ratingB) {
    const diff = Math.abs(ratingA - ratingB);
    if (diff < 50) return "势均力敌";
    if (diff < 100) return "轻微优势";
    if (diff < 150) return "明显优势";
    if (diff < 200) return "较大优势";
    return "碾压优势";
  }
}

class IntegratedPredictor {
  constructor() {
    this.weights = { odds: 0.40, poisson: 0.25, elo: 0.20, qualitative: 0.15 };
  }

  predictMatch(homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, 
               homeAvgGoals = 1.5, awayAvgGoals = 1.3,
               homeAvgConceded = 0.8, awayAvgConceded = 0.9) {
    
    const homeTeamData = getTeamByName(homeTeam) || { elo: 1500 };
    const awayTeamData = getTeamByName(awayTeam) || { elo: 1500 };
    
    const homeElo = homeTeamData.elo;
    const awayElo = awayTeamData.elo;
    
    const eloResult = EloSystem.predictMatch(homeElo, awayElo);
    
    const homeAttack = homeAvgGoals / 2.7;
    const awayAttack = awayAvgGoals / 2.7;
    const poissonResult = PoissonPredictor.calculateMatchProbabilities(homeAttack, homeAvgConceded, awayAttack, awayAvgConceded);
    
    let oddsHome = 0.333, oddsDraw = 0.334, oddsAway = 0.333;
    let margin = null;
    let oddsInterpretation = "无赔率数据";
    
    if (homeOdds && drawOdds && awayOdds) {
      [oddsHome, oddsDraw, oddsAway] = OddsAnalyzer.removeOverround(homeOdds, drawOdds, awayOdds);
      margin = OddsAnalyzer.calculateMargin(homeOdds, drawOdds, awayOdds);
      oddsInterpretation = OddsAnalyzer.getOddsInterpretation(oddsHome, oddsDraw, oddsAway);
    }
    
    const totalWeight = Object.values(this.weights).reduce((a, b) => a + b, 0);
    
    let finalHome = (this.weights.odds * oddsHome + this.weights.poisson * poissonResult.homeWin + 
                     this.weights.elo * eloResult.homeWin + this.weights.qualitative * 0.5) / totalWeight;
    let finalDraw = (this.weights.odds * oddsDraw + this.weights.poisson * poissonResult.draw + 
                     this.weights.elo * eloResult.draw + this.weights.qualitative * 0.5) / totalWeight;
    let finalAway = (this.weights.odds * oddsAway + this.weights.poisson * poissonResult.awayWin + 
                     this.weights.elo * eloResult.awayWin + this.weights.qualitative * 0.5) / totalWeight;
    
    const total = finalHome + finalDraw + finalAway;
    if (total > 0) {
      finalHome /= total;
      finalDraw /= total;
      finalAway /= total;
    }
    
    const confidence = Math.min(95, 70 + Math.abs(finalHome - finalAway) * 50);
    const mostLikelyScores = PoissonPredictor.getMostLikelyScores(poissonResult.scoreProbs, 5);
    
    return {
      home_team: homeTeam,
      away_team: awayTeam,
      probabilities: {
        home: Math.round(finalHome * 10000) / 100,
        draw: Math.round(finalDraw * 10000) / 100,
        away: Math.round(finalAway * 10000) / 100
      },
      expected_goals: {
        home: Math.round((homeAttack * (awayAvgConceded / 2.7)) * 100) / 100,
        away: Math.round((awayAttack * (homeAvgConceded / 2.7)) * 100) / 100
      },
      confidence: Math.round(confidence * 100) / 100,
      most_likely_scores: mostLikelyScores.map(([score, prob]) => ({
        score,
        probability: Math.round(prob * 10000) / 100
      })),
      model_breakdown: {
        elo: {
          home: Math.round(eloResult.homeWin * 10000) / 100,
          draw: Math.round(eloResult.draw * 10000) / 100,
          away: Math.round(eloResult.awayWin * 10000) / 100
        },
        poisson: {
          home: Math.round(poissonResult.homeWin * 10000) / 100,
          draw: Math.round(poissonResult.draw * 10000) / 100,
          away: Math.round(poissonResult.awayWin * 10000) / 100
        },
        odds: {
          home: Math.round(oddsHome * 10000) / 100,
          draw: Math.round(oddsDraw * 10000) / 100,
          away: Math.round(oddsAway * 10000) / 100,
          margin: margin ? Math.round(margin * 100) / 100 : null,
          interpretation: oddsInterpretation
        }
      },
      team_info: { home: homeTeamData, away: awayTeamData },
      match_strength: EloSystem.getMatchStrength(homeElo, awayElo)
    };
  }

  predictChampion() {
    const predictions = WORLD_CUP_2026_TEAMS.map(team => {
      const totalElo = WORLD_CUP_2026_TEAMS.reduce((sum, t) => sum + t.elo, 0);
      let baseProb = team.elo / totalElo;
      const confedFactor = ['UEFA', 'CONMEBOL'].includes(team.confederation) ? 1.1 : 0.9;
      const potFactor = team.pot === 1 ? 1.15 : team.pot === 4 ? 0.95 : 1.0;
      const prob = baseProb * confedFactor * potFactor;
      
      return {
        team_id: team.id,
        name: team.name,
        name_cn: team.name_cn,
        flag: team.flag,
        probability: Math.round(prob * 10000) / 100,
        elo: team.elo,
        group: team.group,
        pot: team.pot
      };
    });
    
    return predictions.sort((a, b) => b.probability - a.probability).slice(0, 10);
  }
}

export { WORLD_CUP_2026_TEAMS, IntegratedPredictor };
