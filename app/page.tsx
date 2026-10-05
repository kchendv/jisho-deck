'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Library, Menu, Download, Shuffle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardView } from '@/components/flashcard-view';
import { FlashcardDialog } from '@/components/flashcard-dialog';
import { CollectionDialog } from '@/components/collection-dialog';
import { BrowseView } from '@/components/browse-view';
import { CollectionsView } from '@/components/collections-view';
import { ThemeToggle } from '@/components/theme-toggle';
import { storage } from '@/lib/storage';
import { Flashcard, Collection, ViewMode } from '@/lib/types';

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [showFlashcardDialog, setShowFlashcardDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>();
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>();

  useEffect(() => {
    setFlashcards(storage.getFlashcards());
    setCollections(storage.getCollections());
  }, []);

  const handleAddFlashcard = (cardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updated = [...flashcards, newCard];
    setFlashcards(updated);
    storage.saveFlashcards(updated);
  };

  const handleUpdateFlashcard = (cardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    if (!editingCard) return;
    const updated = flashcards.map(card =>
      card.id === editingCard.id ? { ...card, ...cardData } : card
    );
    setFlashcards(updated);
    storage.saveFlashcards(updated);
    setEditingCard(undefined);
  };

  const handleDeleteFlashcard = (id: string) => {
    const updated = flashcards.filter(card => card.id !== id);
    setFlashcards(updated);
    storage.saveFlashcards(updated);
  };

  const handleAddCollection = (collectionData: Omit<Collection, 'id' | 'createdAt'>) => {
    const newCollection: Collection = {
      ...collectionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updated = [...collections, newCollection];
    setCollections(updated);
    storage.saveCollections(updated);
  };

  const handleUpdateCollection = (collectionData: Omit<Collection, 'id' | 'createdAt'>) => {
    if (!editingCollection) return;
    const updated = collections.map(collection =>
      collection.id === editingCollection.id ? { ...collection, ...collectionData } : collection
    );
    setCollections(updated);
    storage.saveCollections(updated);
    setEditingCollection(undefined);
  };

  const handleDeleteCollection = (id: string) => {
    const updated = collections.filter(collection => collection.id !== id);
    setCollections(updated);
    storage.saveCollections(updated);
    
    const updatedCards = flashcards.map(card => ({
      ...card,
      collectionIds: card.collectionIds.filter(cId => cId !== id)
    }));
    setFlashcards(updatedCards);
    storage.saveFlashcards(updatedCards);
  };

  const handleStudyAll = () => {
    if (flashcards.length === 0) return;
    setStudyCards([...flashcards]);
    setCurrentIndex(0);
    setViewMode('study');
  };

  const handleStudyCollection = (collectionId: string) => {
    const cards = flashcards.filter(card => card.collectionIds.includes(collectionId));
    if (cards.length === 0) return;
    setStudyCards(cards);
    setCurrentIndex(0);
    setViewMode('study');
  };

  const handleShuffle = () => {
    if (viewMode === 'study' && studyCards.length > 0) {
      const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
      setStudyCards(shuffled);
      setCurrentIndex(0);
    } else if (flashcards.length > 0) {
      setStudyCards([...flashcards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setViewMode('study');
    }
  };

  const handleExportCSV = () => {
    const csvContent = storage.exportToCSV(flashcards, collections);
    storage.downloadCSV(csvContent);
  };

  const openEditDialog = (card: Flashcard) => {
    setEditingCard(card);
    setShowFlashcardDialog(true);
  };

  const openEditCollectionDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setShowCollectionDialog(true);
  };

  const closeFlashcardDialog = () => {
    setEditingCard(undefined);
    setShowFlashcardDialog(false);
  };

  const closeCollectionDialog = () => {
    setEditingCollection(undefined);
    setShowCollectionDialog(false);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="size-9 sm:size-10 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📚</span>
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Japanese Flashcards
                </h1>
                <p className="truncate text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {flashcards.length} cards · {collections.length} collections
                </p>
              </div>
            </div>

            {/* Labels collapse to icons on phones so the row never overflows. */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                disabled={flashcards.length === 0}
                title="Export CSV"
                aria-label="Export CSV"
              >
                <Download />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShuffle}
                disabled={flashcards.length === 0}
                title="Shuffle"
                aria-label="Shuffle"
              >
                <Shuffle />
                <span className="hidden sm:inline">Shuffle</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Tabs share the width evenly on phones, like a segmented control,
              and scroll rather than overflow the page on very narrow screens. */}
          <div className="flex gap-1 py-2 overflow-x-auto no-scrollbar">
            <Button
              variant={viewMode === 'browse' ? 'default' : 'ghost'}
              onClick={() => setViewMode('browse')}
              className="flex-1 gap-1.5 text-xs sm:flex-none sm:gap-2 sm:text-sm"
            >
              <FileText className="size-4" />
              Browse All
            </Button>
            <Button
              variant={viewMode === 'study' ? 'default' : 'ghost'}
              onClick={handleStudyAll}
              disabled={flashcards.length === 0}
              className="flex-1 gap-1.5 text-xs sm:flex-none sm:gap-2 sm:text-sm"
            >
              <BookOpen className="size-4" />
              Study Mode
            </Button>
            <Button
              variant={viewMode === 'collections' ? 'default' : 'ghost'}
              onClick={() => setViewMode('collections')}
              className="flex-1 gap-1.5 text-xs sm:flex-none sm:gap-2 sm:text-sm"
            >
              <Library className="size-4" />
              Collections
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content — bottom padding keeps content clear of the action buttons */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28">
        <AnimatePresence mode="wait">
          {viewMode === 'study' && studyCards.length > 0 && (
            <motion.div
              key="study"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FlashcardView
                card={studyCards[currentIndex]}
                onNext={() => setCurrentIndex(Math.min(currentIndex + 1, studyCards.length - 1))}
                onPrevious={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
                currentIndex={currentIndex}
                total={studyCards.length}
              />
            </motion.div>
          )}

          {viewMode === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BrowseView
                flashcards={flashcards}
                collections={collections}
                onEdit={openEditDialog}
                onDelete={handleDeleteFlashcard}
              />
            </motion.div>
          )}

          {viewMode === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CollectionsView
                flashcards={flashcards}
                collections={collections}
                onEditCollection={openEditCollectionDialog}
                onDeleteCollection={handleDeleteCollection}
                onStudyCollection={handleStudyCollection}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-col gap-3">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => {
              setEditingCollection(undefined);
              setShowCollectionDialog(true);
            }}
            className="rounded-full size-12 sm:size-14 shadow-lg"
            variant="outline"
            aria-label="New collection"
          >
            <Library className="size-5 sm:size-6" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => {
              setEditingCard(undefined);
              setShowFlashcardDialog(true);
            }}
            className="rounded-full size-12 sm:size-14 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600"
            aria-label="New flashcard"
          >
            <Plus className="size-5 sm:size-6" />
          </Button>
        </motion.div>
      </div>

      {/* Dialogs */}
      <FlashcardDialog
        open={showFlashcardDialog}
        onOpenChange={closeFlashcardDialog}
        onSave={editingCard ? handleUpdateFlashcard : handleAddFlashcard}
        card={editingCard}
        collections={collections}
      />

      <CollectionDialog
        open={showCollectionDialog}
        onOpenChange={closeCollectionDialog}
        onSave={editingCollection ? handleUpdateCollection : handleAddCollection}
        collection={editingCollection}
      />
    </div>
  );
}
