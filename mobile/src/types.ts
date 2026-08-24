export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';

export interface DiaryEntry {
  date: string;
  text: string;
  mood: Mood;
  sticker: string;
  createdAt: string;
}
