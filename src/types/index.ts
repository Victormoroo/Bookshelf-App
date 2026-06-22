/**
 * Domain types for the Bookshelf app.
 *
 * The book metadata (title, author, cover, synopsis, etc.) will come from an
 * external books API in a future stage. For now `Book` describes the shape of
 * that data and is fed from a local mock catalog (see `src/data/catalog.ts`).
 */

/** Reading status — the four shelves defined in the Design System. */
export type BookStatus = 'own' | 'reading' | 'read' | 'want';

/** Catalog metadata for a book (future: external API). */
export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  genre: string;
  year: number;
  /** Base solid color used to compose the placeholder cover gradient. */
  color: string;
  description: string;
}

/** A book the user has placed on a shelf, plus their personal reading data. */
export interface LibraryEntry {
  id: number;
  status: BookStatus;
  currentPage: number;
  /** 0 = unrated, otherwise 1–5. */
  rating: number;
}

/** A catalog book merged with the user's library entry. */
export type ShelvedBook = Book & LibraryEntry;

/** Per-status display metadata (label + badge color). */
export interface StatusMeta {
  label: string;
  color: string;
  /** Whether the badge uses dark ink text instead of white. */
  darkText: boolean;
}

/** Resolved theme (actual palette in use). */
export type ThemeMode = 'light' | 'dark';

/** User's theme preference — "system" follows the OS color scheme. */
export type ThemePreference = 'light' | 'dark' | 'system';
