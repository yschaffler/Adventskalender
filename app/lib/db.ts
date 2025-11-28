import Database from 'better-sqlite3';
import path from 'path';

// Database file path - stored in data directory for Docker volume mounting
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'advent.db');

// Create database connection
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS prizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('voucher', 'challenge')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT NOT NULL,
    color TEXT NOT NULL,
    won INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL UNIQUE,
    prize_id INTEGER NOT NULL,
    won_at TEXT NOT NULL,
    FOREIGN KEY (prize_id) REFERENCES prizes(id)
  );
`);

// Seed initial prizes if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM prizes').get() as { count: number };
if (count.count === 0) {
  const insertPrize = db.prepare(`
    INSERT INTO prizes (type, title, description, emoji, color) VALUES (?, ?, ?, ?, ?)
  `);

  const initialPrizes = [
    { type: 'voucher', title: 'Frühstück im Bett', description: 'Du bekommst ein liebevoll zubereitetes Frühstück direkt ans Bett serviert! 🍳', emoji: '🍳', color: '#FFD700' },
    { type: 'challenge', title: 'Kompliment-Tag', description: 'Mache heute 3 Menschen ein ehrliches Kompliment!', emoji: '💝', color: '#FF69B4' },
    { type: 'voucher', title: 'Wellness-Abend', description: 'Ein entspannender Wellness-Abend mit Gesichtsmaske und Tee! 🧖‍♀️', emoji: '🧖‍♀️', color: '#87CEEB' },
    { type: 'voucher', title: 'Kinoabend', description: 'Gemeinsamer Filmabend mit Popcorn und Snacks! 🎬', emoji: '🎬', color: '#DDA0DD' },
    { type: 'voucher', title: 'Lieblingsessen', description: 'Dein absolutes Lieblingsessen wird für dich gekocht! 🍲', emoji: '🍲', color: '#FFA07A' },
    { type: 'voucher', title: 'Kuschel-Coupon', description: 'Einlösbar für eine extra lange Kuschelrunde! 🤗', emoji: '🤗', color: '#FFB6C1' },
    { type: 'voucher', title: 'Massage', description: 'Eine entspannende Schulter- und Rückenmassage! 💆‍♀️', emoji: '💆‍♀️', color: '#B0E0E6' },
    { type: 'voucher', title: 'Café-Besuch', description: 'Gemeinsamer Besuch in deinem Lieblingscafé! ☕', emoji: '☕', color: '#D2B48C' },
    { type: 'voucher', title: 'Haushalts-Frei', description: 'Heute wird der komplette Haushalt für dich erledigt! 🏠', emoji: '🏠', color: '#98D8C8' },
    { type: 'voucher', title: 'Spieleabend', description: 'Gesellschaftsspiel-Abend nach deiner Wahl! 🎲', emoji: '🎲', color: '#ADD8E6' },
    { type: 'challenge', title: 'Foto-Challenge', description: 'Mache heute ein Foto von etwas, das dich glücklich macht!', emoji: '📸', color: '#98FB98' },
    { type: 'challenge', title: 'Dankbarkeit', description: 'Schreibe 5 Dinge auf, für die du heute dankbar bist!', emoji: '🙏', color: '#F0E68C' },
  ];

  const insertMany = db.transaction((prizes: typeof initialPrizes) => {
    for (const prize of prizes) {
      insertPrize.run(prize.type, prize.title, prize.description, prize.emoji, prize.color);
    }
  });

  insertMany(initialPrizes);
}

export interface Prize {
  id: number;
  type: 'voucher' | 'challenge';
  title: string;
  description: string;
  emoji: string;
  color: string;
  won: number;
  created_at: string;
}

export interface HistoryEntry {
  id: number;
  day: number;
  prize_id: number;
  won_at: string;
  prize?: Prize;
}

// Get all prizes
export function getAllPrizes(): Prize[] {
  return db.prepare('SELECT * FROM prizes ORDER BY id').all() as Prize[];
}

// Get available prizes (not won yet)
export function getAvailablePrizes(): Prize[] {
  return db.prepare('SELECT * FROM prizes WHERE won = 0 ORDER BY id').all() as Prize[];
}

// Get prize by ID
export function getPrizeById(id: number): Prize | undefined {
  return db.prepare('SELECT * FROM prizes WHERE id = ?').get(id) as Prize | undefined;
}

// Select a random available prize
export function selectRandomPrize(): Prize | null {
  const available = getAvailablePrizes();
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

// Mark prize as won
export function markPrizeAsWon(prizeId: number): void {
  db.prepare('UPDATE prizes SET won = 1 WHERE id = ?').run(prizeId);
}

// Add to history
export function addToHistory(day: number, prizeId: number): HistoryEntry | null {
  try {
    const now = new Date().toISOString();
    db.prepare('INSERT INTO history (day, prize_id, won_at) VALUES (?, ?, ?)').run(day, prizeId, now);
    return getHistoryEntryByDay(day);
  } catch {
    // Day already exists
    return null;
  }
}

// Get history entry by day
export function getHistoryEntryByDay(day: number): HistoryEntry | null {
  const entry = db.prepare(`
    SELECT h.*, p.type, p.title, p.description, p.emoji, p.color 
    FROM history h 
    JOIN prizes p ON h.prize_id = p.id 
    WHERE h.day = ?
  `).get(day) as (HistoryEntry & Prize) | undefined;
  
  if (!entry) return null;
  
  return {
    id: entry.id,
    day: entry.day,
    prize_id: entry.prize_id,
    won_at: entry.won_at,
    prize: {
      id: entry.prize_id,
      type: entry.type,
      title: entry.title,
      description: entry.description,
      emoji: entry.emoji,
      color: entry.color,
      won: 1,
      created_at: '',
    },
  };
}

// Get all history entries
export function getAllHistory(): HistoryEntry[] {
  const entries = db.prepare(`
    SELECT h.*, p.type, p.title, p.description, p.emoji, p.color 
    FROM history h 
    JOIN prizes p ON h.prize_id = p.id 
    ORDER BY h.won_at DESC
  `).all() as (HistoryEntry & Prize)[];
  
  return entries.map(entry => ({
    id: entry.id,
    day: entry.day,
    prize_id: entry.prize_id,
    won_at: entry.won_at,
    prize: {
      id: entry.prize_id,
      type: entry.type,
      title: entry.title,
      description: entry.description,
      emoji: entry.emoji,
      color: entry.color,
      won: 1,
      created_at: '',
    },
  }));
}

// Check if day has been played
export function isDayPlayed(day: number): boolean {
  const result = db.prepare('SELECT COUNT(*) as count FROM history WHERE day = ?').get(day) as { count: number };
  return result.count > 0;
}

// Add a new prize to the pool
export function addPrize(prize: { type: string; title: string; description: string; emoji: string; color: string }): Prize {
  const result = db.prepare(`
    INSERT INTO prizes (type, title, description, emoji, color) VALUES (?, ?, ?, ?, ?)
  `).run(prize.type, prize.title, prize.description, prize.emoji, prize.color);
  
  return getPrizeById(result.lastInsertRowid as number)!;
}

// Delete a prize from the pool (only if not won)
export function deletePrize(id: number): boolean {
  const result = db.prepare('DELETE FROM prizes WHERE id = ? AND won = 0').run(id);
  return result.changes > 0;
}

// Get stats
export function getStats(): { total: number; won: number; remaining: number } {
  const total = (db.prepare('SELECT COUNT(*) as count FROM prizes').get() as { count: number }).count;
  const won = (db.prepare('SELECT COUNT(*) as count FROM prizes WHERE won = 1').get() as { count: number }).count;
  return { total, won, remaining: total - won };
}

export default db;
