import { NextResponse } from 'next/server';
import { IntegratedPredictor } from '../../lib/predictor';

export async function GET() {
  try {
    const predictor = new IntegratedPredictor();
    const result = predictor.predictChampion();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}