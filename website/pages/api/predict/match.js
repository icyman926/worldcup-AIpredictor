import { IntegratedPredictor } from '../../../lib/predictor';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { home_team, away_team, home_odds, draw_odds, away_odds } = req.body;
      
      if (!home_team || !away_team) {
        return res.status(400).json({ error: 'Both home_team and away_team are required' });
      }
      
      const predictor = new IntegratedPredictor();
      const result = predictor.predictMatch(home_team, away_team, home_odds, draw_odds, away_odds);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
