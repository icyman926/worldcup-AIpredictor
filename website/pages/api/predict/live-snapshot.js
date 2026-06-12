import { getLiveSnapshot } from '../../../lib/live-feed';

export default async function handler(req, res) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.setHeader?.('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { home_team, away_team, apiKeys = {} } = req.body || {};
    if (!home_team || !away_team) {
      res.status(400).json({ error: 'home_team and away_team are required' });
      return;
    }
    const snapshot = await getLiveSnapshot({ homeTeam: home_team, awayTeam: away_team, apiKeys });
    res.status(200).json(snapshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
