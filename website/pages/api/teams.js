import { WORLD_CUP_2026_TEAMS, GROUP_STAGES } from '../../lib/predictor';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { group } = req.query;
    
    if (group) {
      const teams = WORLD_CUP_2026_TEAMS.filter(t => t.group === group.toUpperCase());
      res.status(200).json(teams);
    } else {
      res.status(200).json(WORLD_CUP_2026_TEAMS);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
