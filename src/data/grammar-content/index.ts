import { adjectives } from './adjectives';
import { nouns } from './nouns';
import type { GrammarContent } from './types';

/** Konu anlatımı hazır olan gramer konuları; anahtar `GRAMMAR_TOPICS` içindeki id'dir. */
const GRAMMAR_CONTENT: Record<string, GrammarContent> = {
  nouns,
  adjectives,
};

export function getGrammarContent(topicId: string): GrammarContent | undefined {
  return GRAMMAR_CONTENT[topicId];
}

export function hasGrammarContent(topicId: string): boolean {
  return topicId in GRAMMAR_CONTENT;
}
