import { NextResponse } from 'next/server';
import { IntegratedPredictor } from '../../lib/predictor';

export async function POST(request) {
  try {
    const data = await request.json();
    const predictor = new IntegratedPredictor();
    
    const result = predictor.predictMatch(
      data.home_team,
      data.away_team,
      data.home_odds,
      data.draw_odds,
      data.away_odds,
      data.home_avg_goals || 1.5,
      data.away_avg_goals || 1.3,
      data.home_avg_conceded || 0.8,
      data.away_avg_conceded || 0.9
    );
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}