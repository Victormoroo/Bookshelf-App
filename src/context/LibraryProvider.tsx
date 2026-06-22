/**
 * Library context — the single source of truth for the user's shelves.
 *
 * State is kept in memory only (no persistence / backend yet). All mutations
 * mirror the imported prototype's behavior. Book metadata is merged from the
 * mock catalog; it will later come from an external books API.
 */
import { router } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { catalog, findBook, initialLibrary } from '@/data/catalog';
import type { BookStatus, LibraryEntry, ShelvedBook } from '@/types';
import { useToast } from './ToastProvider';

interface LibraryContextValue {
  entries: LibraryEntry[];
  total: number;
  counts: Record<BookStatus, number>;
  pagesRead: number;
  getEntry: (id: number) => LibraryEntry | undefined;
  getShelvedBook: (id: number) => ShelvedBook | undefined;
  shelfBooks: (status: BookStatus) => ShelvedBook[];
  currentlyReading: ShelvedBook | undefined;
  isInLibrary: (id: number) => boolean;
  quickAdd: (id: number) => void;
  setStatus: (id: number, status: BookStatus) => void;
  setRating: (id: number, rating: number) => void;
  bumpProgress: (id: number, delta: number) => void;
  remove: (id: number) => void;
  reset: () => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

function mergeEntry(entry: LibraryEntry): ShelvedBook | undefined {
  const book = findBook(entry.id);
  return book ? { ...book, ...entry } : undefined;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialLibrary);
  const { showToast } = useToast();

  const getEntry = useCallback(
    (id: number) => entries.find((e) => e.id === id),
    [entries],
  );

  const getShelvedBook = useCallback(
    (id: number) => {
      const entry = entries.find((e) => e.id === id);
      return entry ? mergeEntry(entry) : undefined;
    },
    [entries],
  );

  const isInLibrary = useCallback(
    (id: number) => entries.some((e) => e.id === id),
    [entries],
  );

  const counts = useMemo<Record<BookStatus, number>>(() => {
    const c: Record<BookStatus, number> = { own: 0, reading: 0, read: 0, want: 0 };
    entries.forEach((e) => {
      c[e.status] += 1;
    });
    return c;
  }, [entries]);

  const pagesRead = useMemo(
    () =>
      entries.reduce((sum, e) => {
        const book = findBook(e.id);
        if (!book) return sum;
        if (e.status === 'read') return sum + book.pages;
        if (e.status === 'reading') return sum + e.currentPage;
        return sum;
      }, 0),
    [entries],
  );

  const shelfBooks = useCallback(
    (status: BookStatus) =>
      entries
        .filter((e) => e.status === status)
        .map(mergeEntry)
        .filter((b): b is ShelvedBook => !!b),
    [entries],
  );

  const currentlyReading = useMemo(() => {
    const entry = entries.find((e) => e.status === 'reading');
    return entry ? mergeEntry(entry) : undefined;
  }, [entries]);

  const quickAdd = useCallback(
    (id: number) => {
      if (entries.some((e) => e.id === id)) return;
      const entry: LibraryEntry = { id, status: 'want', currentPage: 0, rating: 0 };
      setEntries((prev) => [entry, ...prev]);
      showToast('Adicionado a "Quero ler"', 'Ver', () => router.push(`/book/${id}`));
    },
    [entries, showToast],
  );

  const setStatus = useCallback((id: number, status: BookStatus) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const book = findBook(id);
        const pages = book?.pages ?? 0;
        let currentPage = e.currentPage;
        if (status === 'read') currentPage = pages;
        else if (status === 'reading' && e.currentPage === 0)
          currentPage = Math.round(pages * 0.05);
        else if (status === 'want' || status === 'own')
          currentPage = e.status === 'read' ? 0 : e.currentPage;
        return { ...e, status, currentPage };
      }),
    );
  }, []);

  const setRating = useCallback((id: number, rating: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, rating: e.rating === rating ? 0 : rating } : e,
      ),
    );
  }, []);

  const bumpProgress = useCallback((id: number, delta: number) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const pages = findBook(id)?.pages ?? 0;
        return {
          ...e,
          currentPage: Math.max(0, Math.min(pages, e.currentPage + delta)),
        };
      }),
    );
  }, []);

  const remove = useCallback(
    (id: number) => {
      const removed = entries.find((e) => e.id === id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (removed) {
        showToast('Removido da estante', 'Desfazer', () =>
          setEntries((prev) => [removed, ...prev]),
        );
      }
    },
    [entries, showToast],
  );

  const reset = useCallback(() => setEntries(initialLibrary), []);

  const value = useMemo<LibraryContextValue>(
    () => ({
      entries,
      total: entries.length,
      counts,
      pagesRead,
      getEntry,
      getShelvedBook,
      shelfBooks,
      currentlyReading,
      isInLibrary,
      quickAdd,
      setStatus,
      setRating,
      bumpProgress,
      remove,
      reset,
    }),
    [
      entries,
      counts,
      pagesRead,
      getEntry,
      getShelvedBook,
      shelfBooks,
      currentlyReading,
      isInLibrary,
      quickAdd,
      setStatus,
      setRating,
      bumpProgress,
      remove,
      reset,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider');
  return ctx;
}

/** Catalog access for screens that search the (mock) book source. */
export function useCatalog() {
  return catalog;
}
