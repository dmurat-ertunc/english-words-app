import type { GradientName } from '@/constants/theme';

export type StoryLevel = {
  id: string;
  label: string;
  name: string;
  description: string;
  gradient: GradientName;
};

/** Avrupa Ortak Dil Çerçevesi (CEFR) seviyeleri. */
export const STORY_LEVELS: StoryLevel[] = [
  { id: 'a1', label: 'A1', name: 'Başlangıç', description: 'Kısa cümleler, günlük kelimeler', gradient: 'grammar' },
  { id: 'a2', label: 'A2', name: 'Temel', description: 'Basit olaylar ve diyaloglar', gradient: 'success' },
  { id: 'b1', label: 'B1', name: 'Orta', description: 'Akıcı, günlük hayattan hikayeler', gradient: 'primary' },
  { id: 'b2', label: 'B2', name: 'Orta Üstü', description: 'Daha uzun ve detaylı anlatımlar', gradient: 'words' },
  { id: 'c1', label: 'C1', name: 'İleri', description: 'Zengin kelime ve karmaşık yapılar', gradient: 'sunset' },
  { id: 'c2', label: 'C2', name: 'Ustalık', description: 'Edebi dil ve ince anlam farkları', gradient: 'danger' },
];

export function getStoryLevel(id: string): StoryLevel | undefined {
  return STORY_LEVELS.find((level) => level.id === id);
}
