import { Mood } from './types';

export const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: 'great', label: '最高', emoji: '😄' },
  { key: 'good', label: '良い', emoji: '🙂' },
  { key: 'okay', label: 'ふつう', emoji: '😐' },
  { key: 'bad', label: 'いまいち', emoji: '😞' },
  { key: 'awful', label: 'つらい', emoji: '😣' },
];

export function moodLabel(mood: Mood): string {
  return MOODS.find((m) => m.key === mood)?.label ?? mood;
}

export function moodEmoji(mood: Mood): string {
  return MOODS.find((m) => m.key === mood)?.emoji ?? '';
}
