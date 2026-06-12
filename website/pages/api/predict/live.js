import { IntegratedPredictor } from '../../../lib/predictor';
import { applyLiveMatchContext } from '../../../lib/live-model';

export default function handler(req, res) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.setHeader?.('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { home_team, away_team, base_result, live_state } = req.body || {};
    if (!home_team || !away_team) {
      res.status(400).json({ error: 'home_team and away_team are required' });
      return;
    }

    const predictor = new IntegratedPredictor();
    const base = base_result || predictor.predictMatch(home_team, away_team, null, null, null, 'neutral', 1.5, 1.3, 0.8, 0.9);
    const live = applyLiveMatchContext(base, { ...(live_state || {}), enabled: true }, { homeTeam: home_team, awayTeam: away_team });
    res.status(200).json(live.live_context || { applied: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
