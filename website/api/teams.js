import { NextResponse } from 'next/server';
import { WORLD_CUP_2026_TEAMS } from '../lib/predictor';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');
  
  let teams = WORLD_CUP_2026_TEAMS;
  if (group) {
    teams = teams.filter(team => team.group === group.toUpperCase());
  }
  
  return NextResponse.json(teams);
}