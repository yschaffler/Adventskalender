// Storage utilities for managing redeemed prizes
import { prizePool, Prize } from './prizes';

export interface RedeemedPrize {
  day: number;
  date: string;
  prizeId: number;
  prizeTitle: string;
  prizeDescription: string;
  prizeType: 'voucher' | 'challenge';
  prizeEmoji: string;
}

const STORAGE_KEY = 'advent_calendar_redeemed';

export function getRedeemedPrizes(): RedeemedPrize[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function isAlreadyRedeemed(day: number): boolean {
  const redeemed = getRedeemedPrizes();
  return redeemed.some((p) => p.day === day);
}

export function getRedeemedPrizeForDay(day: number): RedeemedPrize | undefined {
  const redeemed = getRedeemedPrizes();
  return redeemed.find((p) => p.day === day);
}

// Get all prize IDs that have been won
export function getWonPrizeIds(): number[] {
  const redeemed = getRedeemedPrizes();
  return redeemed.map((p) => p.prizeId);
}

// Get available prizes (not yet won)
export function getAvailablePrizes(): Prize[] {
  const wonIds = getWonPrizeIds();
  return prizePool.filter((p) => !wonIds.includes(p.id));
}

// Select a random prize from available pool
export function selectRandomPrize(): Prize | null {
  const available = getAvailablePrizes();
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

export function redeemPrize(prize: RedeemedPrize): void {
  if (typeof window === 'undefined') return;
  const redeemed = getRedeemedPrizes();
  if (!redeemed.some((p) => p.day === prize.day)) {
    redeemed.push(prize);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(redeemed));
  }
}

export function canRedeemToday(day: number): { canRedeem: boolean; reason?: string } {
  // Get current date in German timezone using Intl.DateTimeFormat
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    day: 'numeric',
    month: 'numeric',
  });
  
  const parts = formatter.formatToParts(now);
  const currentDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const currentMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0');

  // Only allow during December
  if (currentMonth !== 12) {
    return {
      canRedeem: false,
      reason: 'Der Adventskalender kann nur im Dezember geöffnet werden! 🎄',
    };
  }

  // Check if the day matches
  if (currentDay !== day) {
    if (currentDay < day) {
      return {
        canRedeem: false,
        reason: `Dieses Türchen kann erst am ${day}. Dezember geöffnet werden! 🔒`,
      };
    } else {
      return {
        canRedeem: false,
        reason: `Dieses Türchen konnte nur am ${day}. Dezember geöffnet werden! ⏰`,
      };
    }
  }

  // Check if already redeemed
  if (isAlreadyRedeemed(day)) {
    return {
      canRedeem: false,
      reason: 'Du hast heute schon am Glücksrad gedreht! 🎡',
    };
  }

  // Check if there are prizes available
  const available = getAvailablePrizes();
  if (available.length === 0) {
    return {
      canRedeem: false,
      reason: 'Alle Preise wurden schon gewonnen! 🎉',
    };
  }

  return { canRedeem: true };
}
