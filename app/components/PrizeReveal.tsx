'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Prize } from '../lib/prizes';
import { useEffect, useState } from 'react';
import Confetti from './Confetti';

interface PrizeRevealProps {
  prize: Prize;
  show: boolean;
}

export default function PrizeReveal({ prize, show }: PrizeRevealProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShowConfetti(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {showConfetti && <Confetti />}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.8,
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-3xl blur-2xl"
                style={{ backgroundColor: prize.color }}
              />

              <motion.div
                className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 max-w-md shadow-2xl border-4"
                style={{ borderColor: prize.color }}
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div
                    className="px-4 py-1 rounded-full text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: prize.type === 'voucher' ? '#10B981' : '#8B5CF6' }}
                  >
                    {prize.type === 'voucher' ? '🎟️ GUTSCHEIN' : '🎯 CHALLENGE'}
                  </div>
                </motion.div>

                {/* Emoji */}
                <motion.div
                  className="text-8xl text-center mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {prize.emoji}
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-3xl font-bold text-center text-gray-800 mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {prize.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-lg text-center text-gray-600 leading-relaxed"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {prize.description}
                </motion.p>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -left-3 -top-3 text-4xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -right-3 -top-3 text-4xl"
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute -left-3 -bottom-3 text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎄
                </motion.div>
                <motion.div
                  className="absolute -right-3 -bottom-3 text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  🎁
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
