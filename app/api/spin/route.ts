import { NextRequest, NextResponse } from 'next/server';
import { 
  isDayPlayed, 
  getHistoryEntryByDay, 
  selectRandomPrize, 
  markPrizeAsWon, 
  addToHistory,
  getStats
} from '../../lib/db';

// GET /api/spin?day=1 - Check if day can be played and get existing prize if already played
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dayParam = searchParams.get('day');
  
  if (!dayParam) {
    return NextResponse.json({ error: 'Day parameter required' }, { status: 400 });
  }
  
  const day = parseInt(dayParam);
  if (isNaN(day) || day < 1 || day > 24) {
    return NextResponse.json({ error: 'Invalid day (must be 1-24)' }, { status: 400 });
  }
  
  try {
    // Check date validation (German timezone)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin',
      day: 'numeric',
      month: 'numeric',
    });
    
    const parts = formatter.formatToParts(now);
    const currentDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const currentMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    
    // Check if December
    if (currentMonth !== 12) {
      return NextResponse.json({
        canPlay: false,
        reason: 'Der Adventskalender kann nur im Dezember geöffnet werden! 🎄'
      });
    }
    
    // Check if correct day
    if (currentDay !== day) {
      if (currentDay < day) {
        return NextResponse.json({
          canPlay: false,
          reason: `Dieses Türchen kann erst am ${day}. Dezember geöffnet werden! 🔒`
        });
      } else {
        return NextResponse.json({
          canPlay: false,
          reason: `Dieses Türchen konnte nur am ${day}. Dezember geöffnet werden! ⏰`
        });
      }
    }
    
    // Check if day already played
    if (isDayPlayed(day)) {
      const entry = getHistoryEntryByDay(day);
      return NextResponse.json({
        canPlay: false,
        alreadyPlayed: true,
        prize: entry?.prize,
        wonAt: entry?.won_at,
        reason: 'Du hast heute schon am Glücksrad gedreht! 🎡'
      });
    }
    
    // Day can be played
    const stats = getStats();
    if (stats.remaining === 0) {
      return NextResponse.json({
        canPlay: false,
        reason: 'Alle Preise wurden schon gewonnen! 🎉'
      });
    }
    
    return NextResponse.json({
      canPlay: true,
      remainingPrizes: stats.remaining
    });
  } catch {
    return NextResponse.json({ error: 'Failed to check day status' }, { status: 500 });
  }
}

// POST /api/spin - Spin the wheel and get a prize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, demo } = body;
    
    if (!day || typeof day !== 'number' || day < 1 || day > 24) {
      return NextResponse.json({ error: 'Invalid day (must be 1-24)' }, { status: 400 });
    }
    
    // In demo mode, just return a random prize without saving
    if (demo) {
      const prize = selectRandomPrize();
      if (!prize) {
        return NextResponse.json({ error: 'No prizes available' }, { status: 400 });
      }
      return NextResponse.json({ prize, demo: true });
    }
    
    // Check if day already played
    if (isDayPlayed(day)) {
      const entry = getHistoryEntryByDay(day);
      return NextResponse.json({
        error: 'Day already played',
        alreadyPlayed: true,
        prize: entry?.prize
      }, { status: 400 });
    }
    
    // Select random prize
    const prize = selectRandomPrize();
    if (!prize) {
      return NextResponse.json({ error: 'No prizes available' }, { status: 400 });
    }
    
    // Mark prize as won and add to history
    markPrizeAsWon(prize.id);
    const historyEntry = addToHistory(day, prize.id);
    
    return NextResponse.json({
      prize,
      historyEntry,
      stats: getStats()
    });
  } catch {
    return NextResponse.json({ error: 'Failed to spin' }, { status: 500 });
  }
}
