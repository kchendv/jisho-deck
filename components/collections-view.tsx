'use client';

import { Flashcard, Collection } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionsViewProps {
  flashcards: Flashcard[];
  collections: Collection[];
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
  onStudyCollection: (collectionId: string) => void;
}

export function CollectionsView({
  flashcards,
  collections,
  onEditCollection,
  onDeleteCollection,
  onStudyCollection,
}: CollectionsViewProps) {
  const getCardCount = (collectionId: string) => {
    return flashcards.filter(card => card.collectionIds.includes(collectionId)).length;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {collections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No collections yet. Create one to organize your flashcards!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection, index) => {
            const cardCount = getCardCount(collection.id);
            
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="p-5 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderTopColor: collection.color, borderTopWidth: '4px' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditCollection(collection)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete "${collection.name}" collection?`)) {
                            onDeleteCollection(collection.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant="secondary"
                      style={{ 
                        backgroundColor: `${collection.color}20`,
                        color: collection.color 
                      }}
                    >
                      {cardCount} {cardCount === 1 ? 'card' : 'cards'}
                    </Badge>
                    
                    {cardCount > 0 && (
                      <Button
                        size="sm"
                        onClick={() => onStudyCollection(collection.id)}
                        className="gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Study
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
