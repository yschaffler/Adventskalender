'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Snowfall from '../components/Snowfall';
import { getRedeemedPrizes, RedeemedPrize } from '../lib/storage';

export default function HistoryPage() {
  const [prizes, setPrizes] = useState<RedeemedPrize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redeemed = getRedeemedPrizes();
    // Sort by day
    redeemed.sort((a, b) => a.day - b.day);
    setPrizes(redeemed);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 relative overflow-hidden">
      <Snowfall />

      <div className="min-h-screen relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            📜 Deine Gewinne 📜
          </h1>
          <p className="text-white/80 text-lg">Alle eingelösten Gutscheine & Challenges</p>
        </motion.div>

        {/* Prizes grid */}
        {loading ? (
          <div className="text-center text-white text-xl">Laden...</div>
        ) : prizes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20">
              <div className="text-6xl mb-6">🎄</div>
              <p className="text-white text-xl mb-4">Noch keine Gewinne eingelöst!</p>
              <p className="text-white/70">
                Scanne einen QR-Code aus deinem Adventskalender, um dein erstes Türchen zu öffnen.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-yellow-800">{prize.day}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{prize.prizeEmoji}</span>
                      <h3 className="text-xl font-bold text-white">{prize.prizeTitle}</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{prize.prizeDescription}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          backgroundColor: prize.prizeType === 'voucher' ? '#10B981' : '#8B5CF6',
                        }}
                      >
                        {prize.prizeType === 'voucher' ? '🎟️ Gutschein' : '🎯 Challenge'}
                      </span>
                      <span className="text-white/50 text-xs">
                        {new Date(prize.date).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {prizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-yellow-400">{prizes.length}</div>
                <div className="text-white/70 text-sm">Türchen geöffnet</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400">
                  {prizes.filter((p) => p.prizeType === 'voucher').length}
                </div>
                <div className="text-white/70 text-sm">Gutscheine</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">
                  {prizes.filter((p) => p.prizeType === 'challenge').length}
                </div>
                <div className="text-white/70 text-sm">Challenges</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-400">{24 - prizes.length}</div>
                <div className="text-white/70 text-sm">Noch übrig</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 font-medium"
          >
            🏠 Zurück zur Startseite
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
