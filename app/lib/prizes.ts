// Pool of Vouchers and Challenges - a random one is selected each spin
export interface Prize {
  id: number;
  type: 'voucher' | 'challenge';
  title: string;
  description: string;
  emoji: string;
  color: string;
}

// Prize pool - each prize can only be won once
export const prizePool: Prize[] = [
  {
    id: 1,
    type: 'voucher',
    title: 'Frühstück im Bett',
    description: 'Du bekommst ein liebevoll zubereitetes Frühstück direkt ans Bett serviert! 🍳',
    emoji: '🍳',
    color: '#FFD700',
  },
  {
    id: 2,
    type: 'challenge',
    title: 'Kompliment-Tag',
    description: 'Mache heute 3 Menschen ein ehrliches Kompliment!',
    emoji: '💝',
    color: '#FF69B4',
  },
  {
    id: 3,
    type: 'voucher',
    title: 'Wellness-Abend',
    description: 'Ein entspannender Wellness-Abend mit Gesichtsmaske und Tee! 🧖‍♀️',
    emoji: '🧖‍♀️',
    color: '#87CEEB',
  },
  {
    id: 4,
    type: 'voucher',
    title: 'Kinoabend',
    description: 'Gemeinsamer Filmabend mit Popcorn und Snacks! 🎬',
    emoji: '🎬',
    color: '#DDA0DD',
  },
  {
    id: 5,
    type: 'voucher',
    title: 'Lieblingsessen',
    description: 'Dein absolutes Lieblingsessen wird für dich gekocht! 🍲',
    emoji: '🍲',
    color: '#FFA07A',
  },
  {
    id: 6,
    type: 'voucher',
    title: 'Kuschel-Coupon',
    description: 'Einlösbar für eine extra lange Kuschelrunde! 🤗',
    emoji: '🤗',
    color: '#FFB6C1',
  },
  {
    id: 7,
    type: 'voucher',
    title: 'Massage',
    description: 'Eine entspannende Schulter- und Rückenmassage! 💆‍♀️',
    emoji: '💆‍♀️',
    color: '#B0E0E6',
  },
  {
    id: 8,
    type: 'voucher',
    title: 'Café-Besuch',
    description: 'Gemeinsamer Besuch in deinem Lieblingscafé! ☕',
    emoji: '☕',
    color: '#D2B48C',
  },
  {
    id: 9,
    type: 'voucher',
    title: 'Haushalts-Frei',
    description: 'Heute wird der komplette Haushalt für dich erledigt! 🏠',
    emoji: '🏠',
    color: '#98D8C8',
  },
  {
    id: 10,
    type: 'voucher',
    title: 'Spieleabend',
    description: 'Gesellschaftsspiel-Abend nach deiner Wahl! 🎲',
    emoji: '🎲',
    color: '#ADD8E6',
  },
  {
    id: 11,
    type: 'challenge',
    title: 'Foto-Challenge',
    description: 'Mache heute ein Foto von etwas, das dich glücklich macht!',
    emoji: '📸',
    color: '#98FB98',
  },
  {
    id: 12,
    type: 'challenge',
    title: 'Dankbarkeit',
    description: 'Schreibe 5 Dinge auf, für die du heute dankbar bist!',
    emoji: '🙏',
    color: '#F0E68C',
  },
];

// Get a prize by its ID
export function getPrizeById(id: number): Prize | undefined {
  return prizePool.find((p) => p.id === id);
}
