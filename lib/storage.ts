import { Flashcard, Collection } from './types';

const FLASHCARDS_KEY = 'japanese-flashcards';
const COLLECTIONS_KEY = 'japanese-collections';

export const storage = {
  getFlashcards: (): Flashcard[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FLASHCARDS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveFlashcards: (flashcards: Flashcard[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  },

  getCollections: (): Collection[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(COLLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCollections: (collections: Collection[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  },

  exportToCSV: (flashcards: Flashcard[], collections: Collection[]): string => {
    const headers = ['ID', 'Kanji', 'Hiragana', 'Katakana', 'Definition', 'Pronunciation', 'Level', 'Collections'];
    
    const rows = flashcards.map(card => {
      const cardCollections = collections
        .filter(c => card.collectionIds.includes(c.id))
        .map(c => c.name)
        .join('; ');
      
      return [
        card.id,
        card.kanji,
        card.hiragana,
        card.katakana,
        card.definition,
        card.pronunciation,
        card.level,
        cardCollections
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  downloadCSV: (csvContent: string, filename: string = 'flashcards.csv'): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
