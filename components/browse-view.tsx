'use client';

import { Flashcard, Collection } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrowseViewProps {
  flashcards: Flashcard[];
  collections: Collection[];
  onEdit: (card: Flashcard) => void;
  onDelete: (id: string) => void;
}

export function BrowseView({ flashcards, collections, onEdit, onDelete }: BrowseViewProps) {
  const getCollectionName = (id: string) => {
    return collections.find(c => c.id === id)?.name || '';
  };

  const getCollectionColor = (id: string) => {
    return collections.find(c => c.id === id)?.color || '#3b82f6';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {flashcards.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No flashcards yet. Add your first one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl sm:text-3xl font-bold break-words text-gray-900 dark:text-white mb-1">
                      {card.kanji}
                    </div>
                    {(card.hiragana || card.katakana) && (
                      <div className="text-base sm:text-lg break-words text-gray-600 dark:text-gray-400">
                        {card.hiragana} {card.katakana}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(card)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('Delete this flashcard?')) {
                          onDelete(card.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 break-words mb-3">
                  {card.definition}
                </p>

                {card.pronunciation && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    [{card.pronunciation}]
                  </p>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  {card.level && (
                    <Badge variant="outline">{card.level}</Badge>
                  )}
                  {card.collectionIds.map((collectionId) => (
                    <Badge
                      key={collectionId}
                      style={{ backgroundColor: getCollectionColor(collectionId) }}
                    >
                      {getCollectionName(collectionId)}
                    </Badge>
                  ))}
                  <a
                    href={`https://jisho.org/search/${encodeURIComponent(card.kanji)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Jisho <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
