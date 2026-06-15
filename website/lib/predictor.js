const WORLD_CUP_2026_TEAMS = [
  { id: 'MEX', name: 'Mexico', name_cn: '墨西哥', flag: '🇲🇽', confederation: 'CONCACAF', group: 'A', elo: 1862, pot: 1 },
  { id: 'ZAF', name: 'South Africa', name_cn: '南非', flag: '🇿🇦', confederation: 'CAF', group: 'A', elo: 1772, pot: 2 },
  { id: 'KOR', name: 'South Korea', name_cn: '韩国', flag: '🇰🇷', confederation: 'AFC', group: 'A', elo: 1828, pot: 3 },
  { id: 'CZE', name: 'Czech Republic', name_cn: '捷克', flag: '🇨🇿', confederation: 'UEFA', group: 'A', elo: 1842, pot: 4 },
  
  { id: 'CAN', name: 'Canada', name_cn: '加拿大', flag: '🇨🇦', confederation: 'CONCACAF', group: 'B', elo: 1788, pot: 1 },
  { id: 'BOS', name: 'Bosnia and Herzegovina', name_cn: '波黑', flag: '🇧🇦', confederation: 'UEFA', group: 'B', elo: 1794, pot: 2 },
  { id: 'QAT', name: 'Qatar', name_cn: '卡塔尔', flag: '🇶🇦', confederation: 'AFC', group: 'B', elo: 1798, pot: 3 },
  { id: 'SUI', name: 'Switzerland', name_cn: '瑞士', flag: '🇨🇭', confederation: 'UEFA', group: 'B', elo: 1882, pot: 4 },
  
  { id: 'BRA', name: 'Brazil', name_cn: '巴西', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'C', elo: 1978, pot: 1 },
  { id: 'MAR', name: 'Morocco', name_cn: '摩洛哥', flag: '🇲🇦', confederation: 'CAF', group: 'C', elo: 1888, pot: 2 },
  { id: 'HAI', name: 'Haiti', name_cn: '海地', flag: '🇭🇹', confederation: 'CONCACAF', group: 'C', elo: 1756, pot: 3 },
  { id: 'SCO', name: 'Scotland', name_cn: '苏格兰', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', group: 'C', elo: 1820, pot: 4 },
  
  { id: 'USA', name: 'United States', name_cn: '美国', flag: '🇺🇸', confederation: 'CONCACAF', group: 'D', elo: 1826, pot: 1 },
  { id: 'PAR', name: 'Paraguay', name_cn: '巴拉圭', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'D', elo: 1818, pot: 2 },
  { id: 'AUS', name: 'Australia', name_cn: '澳大利亚', flag: '🇦🇺', confederation: 'AFC', group: 'D', elo: 1806, pot: 3 },
  { id: 'TUR', name: 'Turkey', name_cn: '土耳其', flag: '🇹🇷', confederation: 'UEFA', group: 'D', elo: 1858, pot: 4 },
  
  { id: 'GER', name: 'Germany', name_cn: '德国', flag: '🇩🇪', confederation: 'UEFA', group: 'E', elo: 1950, pot: 1 },
  { id: 'CUR', name: 'Curacao', name_cn: '库拉索', flag: '🇨🇼', confederation: 'CONCACAF', group: 'E', elo: 1744, pot: 2 },
  { id: 'CIV', name: "Cote d'Ivoire", name_cn: '科特迪瓦', flag: '🇨🇮', confederation: 'CAF', group: 'E', elo: 1814, pot: 3 },
  { id: 'ECU', name: 'Ecuador', name_cn: '厄瓜多尔', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E', elo: 1820, pot: 4 },
  
  { id: 'NED', name: 'Netherlands', name_cn: '荷兰', flag: '🇳🇱', confederation: 'UEFA', group: 'F', elo: 1958, pot: 1 },
  { id: 'JPN', name: 'Japan', name_cn: '日本', flag: '🇯🇵', confederation: 'AFC', group: 'F', elo: 1852, pot: 2 },
  { id: 'SWE', name: 'Sweden', name_cn: '瑞典', flag: '🇸🇪', confederation: 'UEFA', group: 'F', elo: 1838, pot: 3 },
  { id: 'TUN', name: 'Tunisia', name_cn: '突尼斯', flag: '🇹🇳', confederation: 'CAF', group: 'F', elo: 1778, pot: 4 },
  
  { id: 'BEL', name: 'Belgium', name_cn: '比利时', flag: '🇧🇪', confederation: 'UEFA', group: 'G', elo: 1932, pot: 1 },
  { id: 'EGY', name: 'Egypt', name_cn: '埃及', flag: '🇪🇬', confederation: 'CAF', group: 'G', elo: 1796, pot: 2 },
  { id: 'IRN', name: 'Iran', name_cn: '伊朗', flag: '🇮🇷', confederation: 'AFC', group: 'G', elo: 1812, pot: 3 },
  { id: 'NZL', name: 'New Zealand', name_cn: '新西兰', flag: '🇳🇿', confederation: 'OFC', group: 'G', elo: 1750, pot: 4 },
  
  { id: 'ESP', name: 'Spain', name_cn: '西班牙', flag: '🇪🇸', confederation: 'UEFA', group: 'H', elo: 2048, pot: 1 },
  { id: 'CPV', name: 'Cape Verde', name_cn: '维德角', flag: '🇨🇻', confederation: 'CAF', group: 'H', elo: 1760, pot: 2 },
  { id: 'SAU', name: 'Saudi Arabia', name_cn: '沙特阿拉伯', flag: '🇸🇦', confederation: 'AFC', group: 'H', elo: 1754, pot: 3 },
  { id: 'URU', name: 'Uruguay', name_cn: '乌拉圭', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'H', elo: 1896, pot: 4 },
  
  { id: 'FRA', name: 'France', name_cn: '法国', flag: '🇫🇷', confederation: 'UEFA', group: 'I', elo: 2050, pot: 1 },
  { id: 'SEN', name: 'Senegal', name_cn: '塞内加尔', flag: '🇸🇳', confederation: 'CAF', group: 'I', elo: 1824, pot: 2 },
  { id: 'IRQ', name: 'Iraq', name_cn: '伊拉克', flag: '🇮🇶', confederation: 'AFC', group: 'I', elo: 1776, pot: 3 },
  { id: 'NOR', name: 'Norway', name_cn: '挪威', flag: '🇳🇴', confederation: 'UEFA', group: 'I', elo: 1920, pot: 4 },
  
  { id: 'ARG', name: 'Argentina', name_cn: '阿根廷', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'J', elo: 2010, pot: 1 },
  { id: 'ALG', name: 'Algeria', name_cn: '阿尔及利亚', flag: '🇩🇿', confederation: 'CAF', group: 'J', elo: 1792, pot: 2 },
  { id: 'AUT', name: 'Austria', name_cn: '奥地利', flag: '🇦🇹', confederation: 'UEFA', group: 'J', elo: 1860, pot: 3 },
  { id: 'JOR', name: 'Jordan', name_cn: '约旦', flag: '🇯🇴', confederation: 'AFC', group: 'J', elo: 1762, pot: 4 },
  
  { id: 'POR', name: 'Portugal', name_cn: '葡萄牙', flag: '🇵🇹', confederation: 'UEFA', group: 'K', elo: 1998, pot: 1 },
  { id: 'COD', name: 'DR Congo', name_cn: '刚果民主共和国', flag: '🇨🇩', confederation: 'CAF', group: 'K', elo: 1780, pot: 2 },
  { id: 'UZB', name: 'Uzbekistan', name_cn: '乌兹别克', flag: '🇺🇿', confederation: 'AFC', group: 'K', elo: 1784, pot: 3 },
  { id: 'COL', name: 'Colombia', name_cn: '哥伦比亚', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'K', elo: 1874, pot: 4 },
  
  { id: 'ENG', name: 'England', name_cn: '英格兰', flag: '🏴', confederation: 'UEFA', group: 'L', elo: 2018, pot: 1 },
  { id: 'CRO', name: 'Croatia', name_cn: '克罗地亚', flag: '🇭🇷', confederation: 'UEFA', group: 'L', elo: 1906, pot: 2 },
  { id: 'GHA', name: 'Ghana', name_cn: '加纳', flag: '🇬🇭', confederation: 'CAF', group: 'L', elo: 1768, pot: 3 },
  { id: 'PAN', name: 'Panama', name_cn: '巴拿马', flag: '🇵🇦', confederation: 'CONCACAF', group: 'L', elo: 1742, pot: 4 },
];

const GROUP_STAGES = [
  { group: 'A', matches: [
    { id: 'A1', team1: 'MEX', team2: 'ZAF', date: '2026-06-11', time: '20:00', stadium: 'Estadio Azteca, Mexico City' },
    { id: 'A2', team1: 'KOR', team2: 'CZE', date: '2026-06-12', time: '03:00', stadium: 'Estadio Akron, Guadalajara' },
    { id: 'A3', team1: 'CZE', team2: 'ZAF', date: '2026-06-18', time: '17:00', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'A4', team1: 'MEX', team2: 'KOR', date: '2026-06-19', time: '02:00', stadium: 'Estadio Akron, Guadalajara' },
    { id: 'A5', team1: 'CZE', team2: 'MEX', date: '2026-06-25', time: '02:00', stadium: 'Estadio Azteca, Mexico City' },
    { id: 'A6', team1: 'ZAF', team2: 'KOR', date: '2026-06-25', time: '02:00', stadium: 'Estadio BBVA, Monterrey' },
  ]},
  { group: 'B', matches: [
    { id: 'B1', team1: 'CAN', team2: 'BOS', date: '2026-06-12', time: '20:00', stadium: 'BMO Field, Toronto' },
    { id: 'B2', team1: 'QAT', team2: 'SUI', date: '2026-06-13', time: '20:00', stadium: 'Levi Stadium, Santa Clara' },
    { id: 'B3', team1: 'SUI', team2: 'BOS', date: '2026-06-18', time: '20:00', stadium: 'SoFi Stadium, Los Angeles' },
    { id: 'B4', team1: 'CAN', team2: 'QAT', date: '2026-06-18', time: '23:00', stadium: 'BC Place, Vancouver' },
    { id: 'B5', team1: 'BOS', team2: 'QAT', date: '2026-06-24', time: '20:00', stadium: 'Lumen Field, Seattle' },
    { id: 'B6', team1: 'SUI', team2: 'CAN', date: '2026-06-24', time: '20:00', stadium: 'BC Place, Vancouver' },
  ]},
  { group: 'C', matches: [
    { id: 'C1', team1: 'BRA', team2: 'MAR', date: '2026-06-13', time: '23:00', stadium: 'MetLife Stadium, East Rutherford' },
    { id: 'C2', team1: 'HAI', team2: 'SCO', date: '2026-06-14', time: '02:00', stadium: 'Gillette Stadium, Foxborough' },
    { id: 'C3', team1: 'SCO', team2: 'MAR', date: '2026-06-19', time: '23:00', stadium: 'Gillette Stadium, Foxborough' },
    { id: 'C4', team1: 'BRA', team2: 'HAI', date: '2026-06-20', time: '02:00', stadium: 'Lincoln Financial Field, Philadelphia' },
    { id: 'C5', team1: 'MAR', team2: 'HAI', date: '2026-06-24', time: '23:00', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'C6', team1: 'SCO', team2: 'BRA', date: '2026-06-24', time: '23:00', stadium: 'Hard Rock Stadium, Miami' },
  ]},
  { group: 'D', matches: [
    { id: 'D1', team1: 'USA', team2: 'PAR', date: '2026-06-13', time: '02:00', stadium: 'SoFi Stadium, Los Angeles' },
    { id: 'D2', team1: 'AUS', team2: 'TUR', date: '2026-06-14', time: '05:00', stadium: 'BC Place, Vancouver' },
    { id: 'D3', team1: 'USA', team2: 'AUS', date: '2026-06-19', time: '20:00', stadium: 'Lumen Field, Seattle' },
    { id: 'D4', team1: 'TUR', team2: 'PAR', date: '2026-06-20', time: '05:00', stadium: 'Levi Stadium, Santa Clara' },
    { id: 'D5', team1: 'PAR', team2: 'AUS', date: '2026-06-26', time: '03:00', stadium: 'Levi Stadium, Santa Clara' },
    { id: 'D6', team1: 'TUR', team2: 'USA', date: '2026-06-26', time: '03:00', stadium: 'SoFi Stadium, Los Angeles' },
  ]},
  { group: 'E', matches: [
    { id: 'E1', team1: 'GER', team2: 'CUR', date: '2026-06-14', time: '18:00', stadium: 'NRG Stadium, Houston' },
    { id: 'E2', team1: 'CIV', team2: 'ECU', date: '2026-06-15', time: '00:00', stadium: 'Lincoln Financial Field, Philadelphia' },
    { id: 'E3', team1: 'GER', team2: 'CIV', date: '2026-06-20', time: '21:00', stadium: 'BMO Field, Toronto' },
    { id: 'E4', team1: 'ECU', team2: 'CUR', date: '2026-06-21', time: '01:00', stadium: "Children's Mercy Park, Kansas City" },
    { id: 'E5', team1: 'CUR', team2: 'CIV', date: '2026-06-25', time: '21:00', stadium: 'Lincoln Financial Field, Philadelphia' },
    { id: 'E6', team1: 'ECU', team2: 'GER', date: '2026-06-25', time: '21:00', stadium: 'MetLife Stadium, East Rutherford' },
  ]},
  { group: 'F', matches: [
    { id: 'F1', team1: 'NED', team2: 'JPN', date: '2026-06-14', time: '21:00', stadium: 'AT&T Stadium, Arlington' },
    { id: 'F2', team1: 'SWE', team2: 'TUN', date: '2026-06-15', time: '03:00', stadium: 'Estadio BBVA, Monterrey' },
    { id: 'F3', team1: 'NED', team2: 'SWE', date: '2026-06-20', time: '18:00', stadium: 'NRG Stadium, Houston' },
    { id: 'F4', team1: 'TUN', team2: 'JPN', date: '2026-06-21', time: '05:00', stadium: 'Estadio BBVA, Monterrey' },
    { id: 'F5', team1: 'JPN', team2: 'SWE', date: '2026-06-26', time: '00:00', stadium: 'AT&T Stadium, Arlington' },
    { id: 'F6', team1: 'TUN', team2: 'NED', date: '2026-06-26', time: '00:00', stadium: "Children's Mercy Park, Kansas City" },
  ]},
  { group: 'G', matches: [
    { id: 'G1', team1: 'BEL', team2: 'EGY', date: '2026-06-15', time: '20:00', stadium: 'Lumen Field, Seattle' },
    { id: 'G2', team1: 'IRN', team2: 'NZL', date: '2026-06-16', time: '02:00', stadium: 'SoFi Stadium, Los Angeles' },
    { id: 'G3', team1: 'BEL', team2: 'IRN', date: '2026-06-21', time: '20:00', stadium: 'SoFi Stadium, Los Angeles' },
    { id: 'G4', team1: 'NZL', team2: 'EGY', date: '2026-06-22', time: '02:00', stadium: 'BC Place, Vancouver' },
    { id: 'G5', team1: 'EGY', team2: 'IRN', date: '2026-06-27', time: '04:00', stadium: 'Lumen Field, Seattle' },
    { id: 'G6', team1: 'NZL', team2: 'BEL', date: '2026-06-27', time: '04:00', stadium: 'BC Place, Vancouver' },
  ]},
  { group: 'H', matches: [
    { id: 'H1', team1: 'ESP', team2: 'CPV', date: '2026-06-15', time: '17:00', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'H2', team1: 'SAU', team2: 'URU', date: '2026-06-15', time: '23:00', stadium: 'Hard Rock Stadium, Miami' },
    { id: 'H3', team1: 'ESP', team2: 'SAU', date: '2026-06-21', time: '17:00', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'H4', team1: 'URU', team2: 'CPV', date: '2026-06-21', time: '23:00', stadium: 'Hard Rock Stadium, Miami' },
    { id: 'H5', team1: 'CPV', team2: 'SAU', date: '2026-06-27', time: '01:00', stadium: 'NRG Stadium, Houston' },
    { id: 'H6', team1: 'URU', team2: 'ESP', date: '2026-06-27', time: '01:00', stadium: 'Estadio Akron, Guadalajara' },
  ]},
  { group: 'I', matches: [
    { id: 'I1', team1: 'FRA', team2: 'SEN', date: '2026-06-16', time: '20:00', stadium: 'MetLife Stadium, East Rutherford' },
    { id: 'I2', team1: 'IRQ', team2: 'NOR', date: '2026-06-16', time: '23:00', stadium: 'Gillette Stadium, Foxborough' },
    { id: 'I3', team1: 'FRA', team2: 'IRQ', date: '2026-06-22', time: '22:00', stadium: 'Lincoln Financial Field, Philadelphia' },
    { id: 'I4', team1: 'NOR', team2: 'SEN', date: '2026-06-23', time: '01:00', stadium: 'MetLife Stadium, East Rutherford' },
    { id: 'I5', team1: 'NOR', team2: 'FRA', date: '2026-06-26', time: '20:00', stadium: 'Gillette Stadium, Foxborough' },
    { id: 'I6', team1: 'SEN', team2: 'IRQ', date: '2026-06-26', time: '20:00', stadium: 'BMO Field, Toronto' },
  ]},
  { group: 'J', matches: [
    { id: 'J1', team1: 'ARG', team2: 'ALG', date: '2026-06-17', time: '02:00', stadium: "Children's Mercy Park, Kansas City" },
    { id: 'J2', team1: 'AUT', team2: 'JOR', date: '2026-06-17', time: '05:00', stadium: 'Levi Stadium, Santa Clara' },
    { id: 'J3', team1: 'ARG', team2: 'AUT', date: '2026-06-22', time: '18:00', stadium: 'AT&T Stadium, Arlington' },
    { id: 'J4', team1: 'JOR', team2: 'ALG', date: '2026-06-23', time: '04:00', stadium: 'Levi Stadium, Santa Clara' },
    { id: 'J5', team1: 'ALG', team2: 'AUT', date: '2026-06-28', time: '03:00', stadium: "Children's Mercy Park, Kansas City" },
    { id: 'J6', team1: 'JOR', team2: 'ARG', date: '2026-06-28', time: '03:00', stadium: 'AT&T Stadium, Arlington' },
  ]},
  { group: 'K', matches: [
    { id: 'K1', team1: 'POR', team2: 'COD', date: '2026-06-17', time: '18:00', stadium: 'NRG Stadium, Houston' },
    { id: 'K2', team1: 'UZB', team2: 'COL', date: '2026-06-18', time: '03:00', stadium: 'Estadio Azteca, Mexico City' },
    { id: 'K3', team1: 'POR', team2: 'UZB', date: '2026-06-23', time: '18:00', stadium: 'NRG Stadium, Houston' },
    { id: 'K4', team1: 'COL', team2: 'COD', date: '2026-06-24', time: '03:00', stadium: 'Estadio Akron, Guadalajara' },
    { id: 'K5', team1: 'COL', team2: 'POR', date: '2026-06-28', time: '00:30', stadium: 'Hard Rock Stadium, Miami' },
    { id: 'K6', team1: 'COD', team2: 'UZB', date: '2026-06-28', time: '00:30', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  ]},
  { group: 'L', matches: [
    { id: 'L1', team1: 'ENG', team2: 'CRO', date: '2026-06-17', time: '21:00', stadium: 'AT&T Stadium, Arlington' },
    { id: 'L2', team1: 'GHA', team2: 'PAN', date: '2026-06-18', time: '00:00', stadium: 'BMO Field, Toronto' },
    { id: 'L3', team1: 'ENG', team2: 'GHA', date: '2026-06-23', time: '21:00', stadium: 'Gillette Stadium, Foxborough' },
    { id: 'L4', team1: 'PAN', team2: 'CRO', date: '2026-06-24', time: '00:00', stadium: 'BMO Field, Toronto' },
    { id: 'L5', team1: 'CRO', team2: 'GHA', date: '2026-06-27', time: '22:00', stadium: 'Lincoln Financial Field, Philadelphia' },
    { id: 'L6', team1: 'PAN', team2: 'ENG', date: '2026-06-27', time: '22:00', stadium: 'MetLife Stadium, East Rutherford' },
  ]},
];

function getTeamByName(name) {
  return WORLD_CUP_2026_TEAMS.find(t => t.name.toLowerCase() === name.toLowerCase());
}

function getTeamById(id) {
  return WORLD_CUP_2026_TEAMS.find(t => t.id === id);
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
    if (maxProb >= 0.6) return "Strong odds favor";
    if (maxProb >= 0.5) return "Slight odds favor";
    return "Balanced odds";
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

  static calculateGoalsProbabilities(expectedGoals, maxGoals = 7) {
    const lambda = Math.max(0.15, Math.min(5.0, Number(expectedGoals) || 0));
    const probabilities = [];

    for (let k = 0; k <= maxGoals; k++) {
      probabilities.push(this.poissonProbability(lambda, k));
    }

    const total = probabilities.reduce((a, b) => a + b, 0);
    return total > 0 ? probabilities.map((item) => item / total) : probabilities;
  }

  static calculateMatchProbabilities(homeExpectedGoals, awayExpectedGoals, maxGoals = 7) {
    const homeProbs = this.calculateGoalsProbabilities(homeExpectedGoals, maxGoals);
    const awayProbs = this.calculateGoalsProbabilities(awayExpectedGoals, maxGoals);

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

    const total = homeWin + draw + awayWin;
    if (total > 0) {
      homeWin /= total;
      draw /= total;
      awayWin /= total;
      Object.keys(scoreProbs).forEach((score) => {
        scoreProbs[score] /= total;
      });
    }

    return { homeWin, draw, awayWin, scoreProbs };
  }

  static getMostLikelyScores(scoreProbs, count = 7) {
    return Object.entries(scoreProbs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count);
  }
}

class EloSystem {
  static predictMatch(ratingA, ratingB, kFactor = 25) {
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const expectedB = 1 - expectedA;
    
    const drawProb = Math.min(0.35, Math.max(0.2, 0.5 - Math.abs(expectedA - 0.5) * 0.8));
    const remaining = 1.0 - drawProb;
    
    return {
      homeWin: expectedA * remaining,
      draw: drawProb,
      awayWin: expectedB * remaining
    };
  }

  static getMatchStrength(ratingA, ratingB) {
    const diff = Math.abs(ratingA - ratingB);
    if (diff < 50) return "Evenly matched";
    if (diff < 100) return "Slight advantage";
    if (diff < 150) return "Clear advantage";
    if (diff < 200) return "Strong advantage";
    return "Dominant advantage";
  }
}

class IntegratedPredictor {
  constructor() {
    this.weights = { odds: 0.40, poisson: 0.25, elo: 0.20, qualitative: 0.15 };
  }

  predictMatch(homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, venue = 'neutral',
               homeAvgGoals = 1.5, awayAvgGoals = 1.3,
               homeAvgConceded = 0.8, awayAvgConceded = 0.9) {
    
    const homeTeamData = getTeamByName(homeTeam) || { elo: 1500 };
    const awayTeamData = getTeamByName(awayTeam) || { elo: 1500 };
    
    const homeElo = homeTeamData.elo;
    const awayElo = awayTeamData.elo;
    
    let venueFactor = 1.0;
    if (venue === 'home') {
      venueFactor = 1.1;
    } else if (venue === 'away') {
      venueFactor = 0.9;
    }
    
    const eloResult = EloSystem.predictMatch(homeElo * venueFactor, awayElo / venueFactor);
    const goalClamp = (value) => Math.max(0.25, Math.min(3.8, value));
    const eloGoalEdge = Math.max(-0.45, Math.min(0.45, (homeElo - awayElo) / 420));
    const venueGoalEdge = venue === 'home' ? 0.18 : (venue === 'away' ? -0.18 : 0);
    const homeExpectedGoals = goalClamp((homeAvgGoals * (awayAvgConceded / 1.15)) + eloGoalEdge + venueGoalEdge);
    const awayExpectedGoals = goalClamp((awayAvgGoals * (homeAvgConceded / 1.15)) - eloGoalEdge - venueGoalEdge);
    const poissonResult = PoissonPredictor.calculateMatchProbabilities(homeExpectedGoals, awayExpectedGoals, 7);
    
    let oddsHome = 0.333, oddsDraw = 0.334, oddsAway = 0.333;
    let margin = null;
    let oddsInterpretation = "No odds data";
    
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
    const mostLikelyScores = PoissonPredictor.getMostLikelyScores(poissonResult.scoreProbs, 7);
    
    return {
      home_team: homeTeam,
      away_team: awayTeam,
      probabilities: {
        home: Math.round(finalHome * 10000) / 100,
        draw: Math.round(finalDraw * 10000) / 100,
        away: Math.round(finalAway * 10000) / 100
      },
      expected_goals: {
        home: Math.round(homeExpectedGoals * 100) / 100,
        away: Math.round(awayExpectedGoals * 100) / 100
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
    const averageRating = WORLD_CUP_2026_TEAMS.reduce((sum, team) => sum + team.elo, 0) / WORLD_CUP_2026_TEAMS.length;

    const formMomentum = {
      ESP: 1.08,
      FRA: 1.07,
      ENG: 1.05,
      ARG: 1.04,
      POR: 1.03,
      NOR: 1.08,
      BRA: 0.98,
      BEL: 0.97,
      GER: 1.01,
      NED: 1.01,
    };

    const confederationAdjustment = {
      UEFA: 1.025,
      CONMEBOL: 1.015,
      CAF: 0.985,
      AFC: 0.965,
      CONCACAF: 0.965,
      OFC: 0.94,
    };

    const potAdjustment = {
      1: 1.015,
      2: 1.0,
      3: 0.99,
      4: 0.98,
    };

    const scoredTeams = WORLD_CUP_2026_TEAMS.map((team) => {
      const groupTeams = WORLD_CUP_2026_TEAMS.filter((candidate) => candidate.group === team.group && candidate.id !== team.id);
      const groupAverage = groupTeams.reduce((sum, candidate) => sum + candidate.elo, 0) / Math.max(1, groupTeams.length);
      const strongestGroupOpponent = Math.max(...groupTeams.map((candidate) => candidate.elo));

      const strengthScore = Math.exp((team.elo - averageRating) / 125);
      const groupDifficulty = Math.max(0.90, Math.min(1.08, 1 - ((groupAverage - averageRating) / 1150)));
      const eliteOpponentPenalty = strongestGroupOpponent - team.elo > 80 ? 0.965 : 1.0;
      const pathScore = groupDifficulty * eliteOpponentPenalty;
      const confedScore = confederationAdjustment[team.confederation] || 1.0;
      const seedScore = potAdjustment[team.pot] || 1.0;
      const momentumScore = formMomentum[team.id] || 1.0;
      const rawScore = strengthScore * pathScore * confedScore * seedScore * momentumScore;

      return {
        team,
        rawScore,
        model_breakdown: {
          strength_rating: team.elo,
          strength_score: Math.round(strengthScore * 1000) / 1000,
          path_score: Math.round(pathScore * 1000) / 1000,
          confederation_score: Math.round(confedScore * 1000) / 1000,
          seed_score: Math.round(seedScore * 1000) / 1000,
          momentum_score: Math.round(momentumScore * 1000) / 1000,
        },
      };
    });

    const totalScore = scoredTeams.reduce((sum, entry) => sum + entry.rawScore, 0);

    return scoredTeams
      .map(({ team, rawScore, model_breakdown }) => ({
        team_id: team.id,
        name: team.name,
        name_cn: team.name_cn,
        flag: team.flag,
        flag_code: team.flag_code,
        probability: Math.round((rawScore / totalScore) * 10000) / 100,
        elo: team.elo,
        group: team.group,
        pot: team.pot,
        model_breakdown,
        model_note: 'Hybrid champion model: strength rating leads; group path, recent momentum, confederation context, and seed/pot are smaller adjustments.',
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 16);
  }

  predictGroupStage(group) {
    const groupTeams = WORLD_CUP_2026_TEAMS.filter(t => t.group === group.toUpperCase());
    const predictions = groupTeams.map(team => {
      const teamElo = team.elo;
      const avgOppElo = groupTeams.filter(t => t.id !== team.id).reduce((sum, t) => sum + t.elo, 0) / 3;
      const diff = teamElo - avgOppElo;
      const baseProb = 0.5 + diff / 500;
      return {
        team_id: team.id,
        name: team.name,
        name_cn: team.name_cn,
        flag: team.flag,
        elo: teamElo,
        qualification_prob: Math.round(Math.max(0.1, Math.min(0.9, baseProb)) * 10000) / 100,
        group: group.toUpperCase()
      };
    });
    return predictions.sort((a, b) => b.qualification_prob - a.qualification_prob);
  }
}

export { WORLD_CUP_2026_TEAMS, GROUP_STAGES, getTeamByName, getTeamById, IntegratedPredictor };