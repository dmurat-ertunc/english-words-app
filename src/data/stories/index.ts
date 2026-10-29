import { A1_STORIES } from './a1';
import { A2_STORIES } from './a2';
import { B1_STORIES } from './b1';
import { B2_STORIES } from './b2';
import { C1_STORIES } from './c1';
import { C2_STORIES } from './c2';
import type { Story } from './types';

/** Tüm hikayeler; yeni seviyeler eklendikçe buraya eklenir. */
const STORIES: Story[] = [
  ...A1_STORIES,
  ...A2_STORIES,
  ...B1_STORIES,
  ...B2_STORIES,
  ...C1_STORIES,
  ...C2_STORIES,
];

/** Seviyesine uygun bir okuyucunun yaklaşık okuma hızı (kelime / dakika). */
const WORDS_PER_MINUTE: Record<string, number> = {
  a1: 100,
  a2: 110,
  b1: 130,
  b2: 150,
  c1: 170,
  c2: 190,
};

export function getStoriesByLevel(level: string): Story[] {
  return STORIES.filter((story) => story.level === level);
}

export function getStory(level: string, id: string): Story | undefined {
  return STORIES.find((story) => story.level === level && story.id === id);
}

export function countStoryWords(story: Story): number {
  return story.paragraphs.reduce((sum, paragraph) => sum + paragraph.en.split(/\s+/).length, 0);
}

export function getReadingMinutes(story: Story): number {
  return Math.max(1, Math.round(countStoryWords(story) / (WORDS_PER_MINUTE[story.level] ?? 120)));
}
