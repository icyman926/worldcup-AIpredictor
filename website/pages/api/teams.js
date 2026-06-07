import { WORLD_CUP_2026_TEAMS } from '../../lib/predictor';

const toPublicTeam = (team) => {
  const { name_cn, ...publicTeam } = team;
  return publicTeam;
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { group } = req.query;
  const teams = group
    ? WORLD_CUP_2026_TEAMS.filter((team) => team.group === group.toUpperCase())
    : WORLD_CUP_2026_TEAMS;

  res.status(200).json(teams.map(toPublicTeam));
}
