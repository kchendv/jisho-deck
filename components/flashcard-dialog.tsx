'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Flashcard, Collection } from '@/lib/types';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  card?: Flashcard;
  collections: Collection[];
}

export function FlashcardDialog({ open, onOpenChange, onSave, card, collections }: FlashcardDialogProps) {
  const [formData, setFormData] = useState({
    kanji: '',
    hiragana: '',
    katakana: '',
    definition: '',
    pronunciation: '',
    level: '',
    collectionIds: [] as string[],
  });
  
  const [searchWord, setSearchWord] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [jishoUrl, setJishoUrl] = useState('');

  useEffect(() => {
    if (card) {
      setFormData({
        kanji: card.kanji,
        hiragana: card.hiragana,
        katakana: card.katakana,
        definition: card.definition,
        pronunciation: card.pronunciation,
        level: card.level,
        collectionIds: card.collectionIds,
      });
    } else {
      setFormData({
        kanji: '',
        hiragana: '',
        katakana: '',
        definition: '',
        pronunciation: '',
        level: '',
        collectionIds: [],
      });
    }
    setSearchWord('');
    setJishoUrl('');
  }, [card, open]);

  const handleJishoSearch = async () => {
    if (!searchWord.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/jisho?word=${encodeURIComponent(searchWord)}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          ...formData,
          kanji: data.kanji || '',
          hiragana: data.hiragana || '',
          katakana: data.katakana || '',
          definition: data.definition || '',
          pronunciation: data.pronunciation || '',
          level: data.level || '',
        });
        setJishoUrl(data.jishoUrl);
      } else {
        alert(data.error || 'Failed to fetch from Jisho.org');
      }
    } catch (error) {
      alert('Error connecting to Jisho.org');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const toggleCollection = (collectionId: string) => {
    setFormData({
      ...formData,
      collectionIds: formData.collectionIds.includes(collectionId)
        ? formData.collectionIds.filter(id => id !== collectionId)
        : [...formData.collectionIds, collectionId]
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{card ? 'Edit Flashcard' : 'Add New Flashcard'}</DialogTitle>
          <DialogDescription>
            Search Jisho.org to auto-fill details, or enter information manually.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jisho Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Search Jisho.org</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Enter Japanese word to search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleJishoSearch();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleJishoSearch}
                disabled={isSearching}
                className="shrink-0"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
            {jishoUrl && (
              <a
                href={jishoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View on Jisho.org <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kanji / Word</label>
              <Input
                value={formData.kanji}
                onChange={(e) => setFormData({ ...formData, kanji: e.target.value })}
                placeholder="漢字"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hiragana</label>
              <Input
                value={formData.hiragana}
                onChange={(e) => setFormData({ ...formData, hiragana: e.target.value })}
                placeholder="ひらがな"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Katakana</label>
              <Input
                value={formData.katakana}
                onChange={(e) => setFormData({ ...formData, katakana: e.target.value })}
                placeholder="カタカナ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pronunciation</label>
              <Input
                value={formData.pronunciation}
                onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                placeholder="romaji"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Definition</label>
            <Textarea
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              placeholder="English meaning..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level (JLPT)</label>
            <Input
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              placeholder="e.g., N5, N4, N3, N2, N1"
            />
          </div>

          {/* Collections */}
          {collections.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Add to Collections</label>
              <div className="flex flex-wrap gap-2">
                {collections.map((collection) => (
                  <Badge
                    key={collection.id}
                    variant={formData.collectionIds.includes(collection.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: formData.collectionIds.includes(collection.id) 
                        ? collection.color 
                        : 'transparent',
                      borderColor: collection.color
                    }}
                    onClick={() => toggleCollection(collection.id)}
                  >
                    {collection.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {card ? 'Save Changes' : 'Add Flashcard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
