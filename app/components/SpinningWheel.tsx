'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SpinningWheelProps {
  onSpinComplete: () => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const segments = [
  { color: '#FF6B6B', label: '🎁' },
  { color: '#4ECDC4', label: '⭐' },
  { color: '#FFE66D', label: '🎄' },
  { color: '#95E1D3', label: '✨' },
  { color: '#F38181', label: '🎅' },
  { color: '#AA96DA', label: '❄️' },
  { color: '#FCBAD3', label: '🔔' },
  { color: '#A8D8EA', label: '🌟' },
];

export default function SpinningWheel({ onSpinComplete, isSpinning, setIsSpinning }: SpinningWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Random rotation between 3 and 7 full spins plus random extra
    const spins = 3 + Math.random() * 4;
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);
  };

  useEffect(() => {
    if (isSpinning) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
        setHasSpun(true);
        onSpinComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSpinning, onSpinComplete, setIsSpinning]);

  const segmentAngle = 360 / segments.length;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg" />
        </div>

        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 blur-xl opacity-50 animate-pulse" 
             style={{ width: '340px', height: '340px', margin: '-10px' }} />

        {/* Wheel container */}
        <motion.div
          className="relative w-80 h-80 rounded-full shadow-2xl"
          animate={{ rotate: rotation }}
          transition={{
            duration: 5,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          style={{
            background: `conic-gradient(${segments
              .map(
                (seg, i) =>
                  `${seg.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
              )
              .join(', ')})`,
          }}
        >
          {/* Segment labels */}
          {segments.map((segment, i) => {
            const angle = i * segmentAngle + segmentAngle / 2 - 90;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * 100;
            const y = Math.sin(radians) * 100;
            return (
              <div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `calc(50% + ${x}px - 15px)`,
                  top: `calc(50% + ${y}px - 15px)`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              >
                {segment.label}
              </div>
            );
          })}

          {/* Center button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 
              shadow-lg border-4 border-yellow-200
              flex items-center justify-center text-2xl font-bold text-yellow-800
              transition-all duration-300
              ${isSpinning || hasSpun ? 'cursor-not-allowed opacity-70' : 'hover:scale-110 hover:shadow-xl cursor-pointer'}`}
          >
            {isSpinning ? '🎡' : hasSpun ? '✓' : 'DREH!'}
          </button>
        </motion.div>
      </div>

      {!hasSpun && !isSpinning && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-xl text-center font-medium"
        >
          Drücke auf den Knopf um zu drehen! 🎄
        </motion.p>
      )}

      {isSpinning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-2xl font-bold text-center"
        >
          <span className="animate-pulse">🎄 Das Glücksrad dreht sich... 🎄</span>
        </motion.div>
      )}
    </div>
  );
}
