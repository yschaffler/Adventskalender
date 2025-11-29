'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WelcomeAnimationProps {
  day: number;
  onComplete: () => void;
}

interface Decoration {
  id: number;
  left: number;
  top: number;
  emoji: string;
}

export default function WelcomeAnimation({ day, onComplete }: WelcomeAnimationProps) {
  const [show, setShow] = useState(true);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  useEffect(() => {
    // Generate decorations on client side only
    const emojis = ['❄️', '✨', '⭐', '🎄', '🎁', '🔔'];
    const newDecorations: Decoration[] = [];
    for (let i = 0; i < 20; i++) {
      newDecorations.push({
        id: i,
        left: Math.random() * 100,
        top: 50 + Math.random() * 40,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setDecorations(newDecorations);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-red-800 via-red-700 to-green-800 flex items-center justify-center z-50"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {decorations.map((dec) => (
              <motion.div
                key={dec.id}
                className="absolute text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1.5, 0],
                  y: [0, -50, -100, -150],
                }}
                transition={{
                  duration: 3,
                  delay: dec.id * 0.1,
                  ease: 'easeOut',
                }}
                style={{
                  left: `${dec.left}%`,
                  top: `${dec.top}%`,
                }}
              >
                {dec.emoji}
              </motion.div>
            ))}
          </div>

          <div className="text-center relative z-10">
            {/* Day number */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.5)',
                    '0 0 60px rgba(255, 215, 0, 0.8)',
                    '0 0 20px rgba(255, 215, 0, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <span className="text-7xl font-bold text-yellow-800">{day}</span>
              </motion.div>
            </motion.div>

            {/* Welcome text */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white mt-8 mb-4"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {day}. Dezember
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl text-white/90"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              🎄 Dein Adventskalender-Türchen 🎄
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block text-4xl"
              >
                ❄️
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
