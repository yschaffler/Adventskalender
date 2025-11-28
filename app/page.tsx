'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Snowfall from './components/Snowfall';
import { useEffect, useState } from 'react';
import { getRedeemedPrizes } from './lib/storage';
import { prizePool } from './lib/prizes';

export default function Home() {
  const [redeemedCount, setRedeemedCount] = useState(0);
  const [totalPrizes, setTotalPrizes] = useState(0);

  useEffect(() => {
    setRedeemedCount(getRedeemedPrizes().length);
    setTotalPrizes(prizePool.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 relative overflow-hidden">
      <Snowfall />

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🎄
          </motion.div>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}
          >
            Adventskalender
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-white/90"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Für die beste Mama der Welt 💝
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-12 text-4xl"
        >
          {['❄️', '✨', '🎁', '✨', '❄️'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-lg text-center border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🎅 Willkommen!</h2>
          <p className="text-white/90 mb-6 leading-relaxed">
            Scanne den QR-Code aus deinem Adventskalender-Tütchen,
            um am Glücksrad zu drehen und einen zufälligen Gewinn zu erhalten!
          </p>
          <div className="flex justify-center gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">{redeemedCount}</div>
              <div className="text-white/70 text-sm">Gewonnen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{totalPrizes - redeemedCount}</div>
              <div className="text-white/70 text-sm">Im Pool übrig</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/history"
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 rounded-full transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            📜 Meine Gewinne ansehen
          </Link>
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 flex gap-2 text-2xl"
        >
          {['🎄', '⭐', '🎁', '🔔', '❄️', '🎅', '🦌', '🎄'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
