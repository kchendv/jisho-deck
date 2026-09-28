'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collection } from '@/lib/types';

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (collection: Omit<Collection, 'id' | 'createdAt'>) => void;
  collection?: Collection;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export function CollectionDialog({ open, onOpenChange, onSave, collection }: CollectionDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description,
        color: collection.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: PRESET_COLORS[0],
      });
    }
  }, [collection, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{collection ? 'Edit Collection' : 'Create Collection'}</DialogTitle>
          <DialogDescription>
            Organize your flashcards into collections for easier study.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Daily Vocabulary, Verbs, JLPT N3"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this collection for?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-10 h-10 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: formData.color === color ? '#000' : 'transparent',
                    transform: formData.color === color ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {collection ? 'Save Changes' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
