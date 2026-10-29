import rawWords from '@/data/oxford3000-turkce.json';

export type Word = {
  id: number;
  word: string;
  turkish: string;
  /** Kelimenin farklı anlamlarını ve (fiillerde) V2/V3 hallerini gösteren örnek cümleler. */
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  s5: string;
};

/** "en-tr": İngilizce sorulur, Türkçe şıklar; "tr-en": Türkçe sorulur, İngilizce şıklar. */
export type QuizDirection = 'en-tr' | 'tr-en';

export type Question = {
  word: Word;
  prompt: string;
  options: string[];
  answer: string;
};

export const WORDS: Word[] = rawWords;

export const WORD_COUNT_OPTIONS = [5, 10, 15, 20] as const;

const OPTION_COUNT = 4;

/** Fisher-Yates ile karıştırılmış yeni bir dizi döndürür. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Her gün değişen, gün içinde sabit kalan bir kelime döndürür. */
export function getWordOfTheDay(date = new Date()): Word {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return WORDS[dayNumber % WORDS.length];
}

/** Seçim için gereken ilerleme alanları (veritabanındaki `word_progress` satırıyla uyumlu). */
type WordProgressLike = {
  word_id: number;
  last_result: number | null;
  last_seen_at: string | null;
  learned: number;
};

const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]));

export function getWordById(id: number): Word | undefined {
  return WORD_BY_ID.get(id);
}

/** Bir testte tekrar için ayrılan en fazla pay. */
const REVIEW_SHARE = 0.4;

export function isWordLearned(progress: WordProgressLike): boolean {
  return progress.learned === 1;
}

/**
 * Kullanıcının ilerlemesine göre kelime seçer: önce son cevabı yanlış olanlar (en eski önce,
 * en fazla %40), sonra hiç görülmemişler, sonra öğrenilmemiş olanlar. Öğrenilmiş kelimeler
 * ancak başka kelime kalmazsa gelir.
 */
export function pickWordsForStudy(count: number, progress: readonly WordProgressLike[]): Word[] {
  const progressById = new Map(progress.map((item) => [item.word_id, item]));
  const picked = new Map<number, Word>();
  const addFrom = (pool: readonly Word[], limit = count) => {
    for (const word of pool) {
      if (picked.size >= limit) break;
      picked.set(word.id, word);
    }
  };

  const review = progress
    .filter((item) => item.last_result === 0 && !isWordLearned(item))
    .sort((a, b) => (a.last_seen_at ?? '').localeCompare(b.last_seen_at ?? ''))
    .map((item) => WORD_BY_ID.get(item.word_id))
    .filter((word): word is Word => word !== undefined);
  addFrom(review, Math.ceil(count * REVIEW_SHARE));

  addFrom(shuffle(WORDS.filter((word) => !progressById.has(word.id))));

  addFrom(
    shuffle(
      WORDS.filter((word) => {
        const item = progressById.get(word.id);
        return item !== undefined && !isWordLearned(item);
      }),
    ),
  );

  addFrom(shuffle(WORDS));

  return shuffle([...picked.values()]);
}

/**
 * Yazılan cevabı karşılaştırma için sadeleştirir: büyük/küçük harf, boşluk, tire ve
 * kesme işareti farklarını yok sayar; Türkçe klavyeden gelen "ı/İ" harflerini "i" sayar.
 */
function normalizeAnswer(text: string): string {
  return text
    .replace(/[ıİ]/g, 'i')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

export function isWrittenAnswerCorrect(input: string, word: Word): boolean {
  const normalized = normalizeAnswer(input);
  return normalized.length > 0 && normalized === normalizeAnswer(word.word);
}

/** "abandon" → "a _ _ _ _ _ _"; harf olmayan karakterler (boşluk, tire) korunur. */
export function maskWord(word: string, revealFirst: boolean): string {
  return [...word]
    .map((char, index) => (/[a-z]/i.test(char) && !(revealFirst && index === 0) ? '_' : char))
    .join(' ');
}

/**
 * Her kelime için bir soru üretir; sorular ve şıklar rastgele sıradadır.
 * Yanlış şıklar, sorulan yöne göre JSON'daki diğer kelimelerin Türkçe ya da İngilizce karşılıklarıdır.
 */
export function buildQuestions(words: Word[], direction: QuizDirection = 'en-tr'): Question[] {
  const optionOf = (word: Word) => (direction === 'en-tr' ? word.turkish : word.word);

  return shuffle(words).map((word) => {
    const answer = optionOf(word);
    const wrongOptions = new Set<string>();
    while (wrongOptions.size < OPTION_COUNT - 1) {
      const candidate = WORDS[Math.floor(Math.random() * WORDS.length)];
      // Aynı Türkçe anlama sahip kelimeler (ör. accuse / blame) ikinci bir doğru cevap olurdu.
      if (candidate.turkish !== word.turkish && optionOf(candidate) !== answer) {
        wrongOptions.add(optionOf(candidate));
      }
    }

    return {
      word,
      prompt: direction === 'en-tr' ? word.word : word.turkish,
      answer,
      options: shuffle([answer, ...wrongOptions]),
    };
  });
}
