/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { HistoryItem, QrType, QrStyleSettings } from '../types';

const STORAGE_KEY = 'qr_generator_pro_history';

export function useQrHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<QrType | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryItem[];
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load QR code history from local storage:', e);
    }
  }, []);

  // Save history to local storage whenever it changes
  const saveHistoryToStorage = (updatedHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (e) {
      console.error('Failed to save QR code history to local storage:', e);
    }
  };

  // Add a generated QR to history
  const addToHistory = (type: QrType, title: string, payload: string, style: QrStyleSettings) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      type,
      title: title.trim() || `Untitled ${type.toUpperCase()}`,
      payload,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      style: { ...style },
    };

    const updated = [newItem, ...history];
    saveHistoryToStorage(updated);
    return newItem;
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const updated = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveHistoryToStorage(updated);
  };

  // Delete individual item
  const deleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryToStorage(updated);
  };

  // Clear all history
  const clearAllHistory = () => {
    saveHistoryToStorage([]);
  };

  // Export history to JSON
  const exportHistoryToJson = (): string => {
    return JSON.stringify(history, null, 2);
  };

  // Import history from JSON with structural schema validation
  const importHistoryFromJson = (jsonString: string): { success: boolean; count: number; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'Import file must contain a JSON array of items.' };
      }

      // Filter and validate items
      const validatedItems: HistoryItem[] = parsed.filter((item: any) => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.type === 'string' &&
          typeof item.title === 'string' &&
          typeof item.payload === 'string' &&
          typeof item.createdAt === 'string'
        );
      });

      if (validatedItems.length === 0) {
        return { success: false, count: 0, error: 'No valid QR code history items found in the file.' };
      }

      // Merge items preventing duplicate IDs
      const existingIds = new Set(history.map((h) => h.id));
      const newItemsToAdd = validatedItems.filter((item) => !existingIds.has(item.id));

      const merged = [...newItemsToAdd, ...history];
      saveHistoryToStorage(merged);

      return { success: true, count: newItemsToAdd.length };
    } catch (e) {
      console.error('Error importing history JSON:', e);
      return { success: false, count: 0, error: 'Invalid JSON format.' };
    }
  };

  // Filter and search history logic combined
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 1. Search Query filter (matches title, payload, or type)
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.payload.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      // 2. Type Filter
      const matchesType = typeFilter === 'all' || item.type === typeFilter;

      // 3. Favorite Filter
      const matchesFavorite = !favoritesOnly || item.isFavorite;

      return matchesSearch && matchesType && matchesFavorite;
    });
  }, [history, searchQuery, typeFilter, favoritesOnly]);

  return {
    history,
    filteredHistory,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    favoritesOnly,
    setFavoritesOnly,
    addToHistory,
    toggleFavorite,
    deleteItem,
    clearAllHistory,
    exportHistoryToJson,
    importHistoryFromJson,
  };
}
