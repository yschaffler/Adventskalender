'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Snowfall from '../../components/Snowfall';
import WelcomeAnimation from '../../components/WelcomeAnimation';
import SpinningWheel from '../../components/SpinningWheel';
import PrizeReveal from '../../components/PrizeReveal';
import { Prize } from '../../lib/prizes';
import Link from 'next/link';

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayId = parseInt(params.id as string);
  const isDemo = searchParams.get('demo') === 'true';
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [canPlay, setCanPlay] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
  const [redeemedPrize, setRedeemedPrize] = useState<Prize | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate day
    if (isNaN(dayId) || dayId < 1 || dayId > 24) {
      router.push('/');
      return;
    }

    // In demo mode, skip date checks
    if (isDemo) {
      setCanPlay(true);
      setLoading(false);
      return;
    }

    // Check with API if we can play
    const checkCanPlay = async () => {
      try {
        const response = await fetch(`/api/spin?day=${dayId}`);
        const data = await response.json();
        
        if (data.canPlay) {
          setCanPlay(true);
        } else {
          setCanPlay(false);
          setErrorMessage(data.reason || 'Nicht verfügbar');
          
          if (data.alreadyPlayed && data.prize) {
            setAlreadyRedeemed(true);
            setRedeemedPrize(data.prize);
          }
        }
      } catch {
        setErrorMessage('Fehler beim Laden');
        setCanPlay(false);
      } finally {
        setLoading(false);
      }
    };

    checkCanPlay();
  }, [dayId, router, isDemo]);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const handleSpinComplete = useCallback(async () => {
    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: dayId, demo: isDemo }),
      });
      
      const data = await response.json();
      
      if (data.prize) {
        setPrize(data.prize);
        setTimeout(() => {
          setShowPrize(true);
        }, 500);
      } else if (data.error) {
        setErrorMessage(data.error);
        setCanPlay(false);
      }
    } catch {
      setErrorMessage('Fehler beim Drehen');
    }
  }, [dayId, isDemo]);

  // Invalid day
  if (isNaN(dayId) || dayId < 1 || dayId > 24) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 relative overflow-hidden">
      <Snowfall />
      
      {showWelcome && <WelcomeAnimation day={dayId} onComplete={handleWelcomeComplete} />}
      
      {!showWelcome && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              🎄 {dayId}. Dezember 🎄
            </h1>
            <p className="text-white/80 text-lg">Adventskalender für Mama</p>
          </motion.div>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl animate-spin">🎡</div>
              <p className="text-white mt-4">Laden...</p>
            </motion.div>
          )}

          {/* Already redeemed - show the prize */}
          {!loading && alreadyRedeemed && redeemedPrize && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20">
                <p className="text-white text-xl mb-6">Du hast heute schon gedreht! 🎡</p>
                <p className="text-white/80 mb-4">Dein Gewinn war:</p>
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-6xl mb-4">{redeemedPrize.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{redeemedPrize.title}</h3>
                  <p className="text-gray-600">{redeemedPrize.description}</p>
                  <div
                    className="inline-block mt-4 px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: redeemedPrize.type === 'voucher' ? '#10B981' : '#8B5CF6' }}
                  >
                    {redeemedPrize.type === 'voucher' ? '🎟️ GUTSCHEIN' : '🎯 CHALLENGE'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cannot play - show error */}
          {!loading && !alreadyRedeemed && canPlay === false && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20">
                <div className="text-6xl mb-6">🔒</div>
                <p className="text-white text-xl">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Can play - show wheel */}
          {!loading && !alreadyRedeemed && canPlay === true && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SpinningWheel
                onSpinComplete={handleSpinComplete}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            </motion.div>
          )}

          {/* Prize reveal */}
          {prize && <PrizeReveal prize={prize} show={showPrize} />}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex gap-4"
          >
            <Link
              href="/"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              🏠 Startseite
            </Link>
            <Link
              href="/history"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              📜 Meine Gewinne
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
