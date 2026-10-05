'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FlashcardViewProps {
  card: Flashcard;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  total: number;
}

export function FlashcardView({ card, onNext, onPrevious, currentIndex, total }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-1">
        <span>Card {currentIndex + 1} of {total}</span>
        {card.level && <Badge variant="outline">{card.level}</Badge>}
      </div>

      <motion.div
        className="perspective-1000 touch-manipulation"
        onClick={handleFlip}
      >
        <motion.div
          className="relative h-80 sm:h-96 cursor-pointer select-none"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-5 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="text-4xl sm:text-6xl font-bold leading-tight break-words text-gray-900 dark:text-white">
                {card.kanji}
              </div>
              {card.hiragana && (
                <div className="text-xl sm:text-2xl break-words text-gray-600 dark:text-gray-300">
                  {card.hiragana}
                </div>
              )}
              {card.katakana && (
                <div className="text-xl sm:text-2xl break-words text-gray-600 dark:text-gray-300">
                  {card.katakana}
                </div>
              )}
              {card.pronunciation && (
                <div className="text-base sm:text-lg break-words text-gray-500 dark:text-gray-400">
                  [{card.pronunciation}]
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-6 sm:mt-8">
                Tap to reveal meaning
              </div>
            </div>
          </Card>

          {/* Back of card */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-5 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="text-2xl sm:text-3xl font-bold break-words text-gray-900 dark:text-white mb-3 sm:mb-4">
                {card.kanji}
              </div>
              <div className="text-base sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                {card.definition}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-6 sm:mt-8">
                Tap to flip back
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <div className="flex gap-3 sm:gap-4 justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Previous
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
