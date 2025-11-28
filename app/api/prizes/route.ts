import { NextRequest, NextResponse } from 'next/server';
import { getAllPrizes, getAvailablePrizes, addPrize, deletePrize, getStats } from '../../lib/db';

// GET /api/prizes - Get all prizes or available prizes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const available = searchParams.get('available') === 'true';
  
  try {
    if (available) {
      const prizes = getAvailablePrizes();
      return NextResponse.json({ prizes, count: prizes.length });
    }
    
    const prizes = getAllPrizes();
    const stats = getStats();
    return NextResponse.json({ prizes, stats });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch prizes' }, { status: 500 });
  }
}

// POST /api/prizes - Add a new prize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, emoji, color } = body;
    
    if (!type || !title || !description || !emoji || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (type !== 'voucher' && type !== 'challenge') {
      return NextResponse.json({ error: 'Type must be voucher or challenge' }, { status: 400 });
    }
    
    const prize = addPrize({ type, title, description, emoji, color });
    return NextResponse.json({ prize }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add prize' }, { status: 500 });
  }
}

// DELETE /api/prizes?id=1 - Delete a prize (only if not won)
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Prize ID required' }, { status: 400 });
  }
  
  try {
    const deleted = deletePrize(parseInt(id));
    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Prize not found or already won' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to delete prize' }, { status: 500 });
  }
}
