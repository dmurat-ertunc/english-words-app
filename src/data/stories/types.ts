export type StoryParagraph = {
  en: string;
  tr: string;
};

export type StoryWord = {
  word: string;
  tr: string;
};

export type Story = {
  id: string;
  /** `STORY_LEVELS` içindeki seviye id'si, ör. "a1". */
  level: string;
  emoji: string;
  title: string;
  titleTr: string;
  paragraphs: StoryParagraph[];
  vocabulary: StoryWord[];
};
