/**
 * Mock catalog + initial library.
 *
 * TEMPORARY: these records stand in for an external books API that will supply
 * title / author / cover / synopsis / publisher / ISBN / categories in a later
 * stage. They exist only to compose the screens visually. Do not build manual
 * book-entry flows on top of this — the real source will replace it.
 */
import type { Book, LibraryEntry } from '@/types';

export const catalog: Book[] = [
  { id: 1, title: 'A Biblioteca da Meia-Noite', author: 'Matt Haig', pages: 272, genre: 'Ficção', year: 2021, color: '#114B5F', description: 'Entre a vida e a morte há uma biblioteca infinita, onde cada livro é uma chance de viver uma vida diferente.' },
  { id: 2, title: 'Torto Arado', author: 'Itamar Vieira Junior', pages: 264, genre: 'Ficção', year: 2019, color: '#7A4A2E', description: 'Duas irmãs e um segredo de infância no sertão da Bahia, em uma narrativa sobre terra, herança e ancestralidade.' },
  { id: 3, title: 'A Hora da Estrela', author: 'Clarice Lispector', pages: 96, genre: 'Ficção', year: 1977, color: '#2E7C8C', description: 'A delicada e pungente história de Macabéa, uma migrante nordestina perdida na cidade grande.' },
  { id: 4, title: 'Pequeno Manual Antirracista', author: 'Djamila Ribeiro', pages: 136, genre: 'Ensaio', year: 2019, color: '#6B3A3A', description: 'Onze lições curtas e essenciais para combater o racismo no dia a dia.' },
  { id: 5, title: 'O Conto da Aia', author: 'Margaret Atwood', pages: 368, genre: 'Distopia', year: 1985, color: '#3E5C4E', description: 'Em uma teocracia totalitária, mulheres são reduzidas à função reprodutiva. Um clássico distópico.' },
  { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', pages: 464, genre: 'História', year: 2011, color: '#46506B', description: 'Uma breve história da humanidade, da Idade da Pedra à revolução tecnológica.' },
  { id: 7, title: 'A Coragem de Ser Imperfeito', author: 'Brené Brown', pages: 208, genre: 'Autoajuda', year: 2012, color: '#C5872F', description: 'Sobre vulnerabilidade, coragem e como abraçar quem realmente somos.' },
  { id: 8, title: 'O Nome do Vento', author: 'Patrick Rothfuss', pages: 656, genre: 'Fantasia', year: 2007, color: '#0C323F', description: 'A história de Kvothe, o mago lendário, narrada por ele mesmo em uma estalagem isolada.' },
  { id: 9, title: 'Mulheres que Correm com os Lobos', author: 'Clarissa P. Estés', pages: 560, genre: 'Ensaio', year: 1992, color: '#6B3A3A', description: 'Mitos e contos que resgatam a natureza instintiva e selvagem do feminino.' },
  { id: 10, title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', pages: 432, genre: 'Ficção', year: 1967, color: '#7A4A2E', description: 'A saga da família Buendía na mítica Macondo, obra-prima do realismo mágico.' },
  { id: 11, title: 'A Redoma de Vidro', author: 'Sylvia Plath', pages: 288, genre: 'Ficção', year: 1963, color: '#46506B', description: 'O retrato íntimo e perturbador de uma jovem em colapso na Nova York dos anos 1950.' },
  { id: 12, title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', pages: 96, genre: 'Fábula', year: 1943, color: '#2E7C8C', description: 'O encontro de um aviador com um pequeno príncipe que viaja entre planetas. Uma fábula atemporal.' },
];

/** Marina's starting shelf (matches the prototype). */
export const initialLibrary: LibraryEntry[] = [
  { id: 1, status: 'reading', currentPage: 168, rating: 0 },
  { id: 2, status: 'own', currentPage: 0, rating: 0 },
  { id: 3, status: 'want', currentPage: 0, rating: 0 },
  { id: 4, status: 'read', currentPage: 136, rating: 5 },
  { id: 5, status: 'own', currentPage: 0, rating: 0 },
  { id: 6, status: 'read', currentPage: 464, rating: 4 },
  { id: 7, status: 'want', currentPage: 0, rating: 0 },
  { id: 8, status: 'own', currentPage: 0, rating: 0 },
];

export function findBook(id: number): Book | undefined {
  return catalog.find((b) => b.id === id);
}
