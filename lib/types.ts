export interface Flashcard {
  id: string;
  kanji: string;
  hiragana: string;
  katakana: string;
  definition: string;
  pronunciation: string;
  level: string;
  collectionIds: string[];
  createdAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
}

export type ViewMode = 'study' | 'browse' | 'collections';
