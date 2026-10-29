/**
 * Gramer konu anlatımlarının veri modeli. Metinlerde **çift yıldız** arası vurgulanır.
 */

export type Example = {
  en: string;
  tr?: string;
};

export type GrammarBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'examples'; items: Example[] }
  | { type: 'note'; tone: 'tip' | 'warning' | 'info'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'chips'; title?: string; items: string[] }
  /** Sıralama şeması, ör. sıfat dizilişi. */
  | { type: 'formula'; steps: string[]; example?: Example }
  /** Kalıp + anlam + örnek, ör. "afraid + OF". */
  | { type: 'patterns'; items: { pattern: string; meaning: string; example: Example }[] }
  /** Doğru ve yanlış kullanımların yan yana gösterimi. */
  | { type: 'correctWrong'; items: { text: string; correct: boolean; note?: string }[] };

export type GrammarSection = {
  id: string;
  code: string;
  title: string;
  turkish?: string;
  blocks: GrammarBlock[];
};

export type GrammarExercise = {
  /** Boşluk "___" ile gösterilir. */
  sentence: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type GrammarContent = {
  intro: string;
  sections: GrammarSection[];
  exercises: GrammarExercise[];
};
