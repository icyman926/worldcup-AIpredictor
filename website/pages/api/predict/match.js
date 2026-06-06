import { IntegratedPredictor } from '../../../lib/predictor';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { home_team, away_team, venue, home_odds, draw_odds, away_odds } = req.body;
      
      if (!home_team || !away_team) {
        return res.status(400).json({ error: 'Both home_team and away_team are required' });
      }
      
      const predictor = new IntegratedPredictor();
      const result = predictor.predictMatch(
        home_team, 
        away_team, 
        home_odds || null, 
        draw_odds || null, 
        away_odds || null, 
        venue || 'neutral',
        1.5,  // homeAvgGoals
        1.3,  // awayAvgGoals
        0.8,  // homeAvgConceded
        0.9   // awayAvgConceded
      );
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
