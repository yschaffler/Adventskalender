import { NextResponse } from 'next/server';
import { getAllHistory, getStats } from '../../lib/db';

// GET /api/history - Get all history entries
export async function GET() {
  try {
    const history = getAllHistory();
    const stats = getStats();
    return NextResponse.json({ history, stats });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
