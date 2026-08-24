export interface StickerCatalogItem {
  emoji: string;
  label: string;
  rarity: 'common' | 'rare';
  howToGet: string;
}

export const COMMON_STICKERS: StickerCatalogItem[] = [
  { emoji: '🌱', label: '芽', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🍀', label: 'クローバー', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '⭐', label: '星', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🌸', label: '桜', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🐣', label: 'ひよこ', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🎈', label: '風船', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🍉', label: 'すいか', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🌈', label: 'にじ', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🦋', label: 'ちょう', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🍩', label: 'ドーナツ', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🌻', label: 'ひまわり', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🔥', label: '炎', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🐚', label: '貝殻', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
  { emoji: '🍄', label: 'きのこ', rarity: 'common', howToGet: '記録するとランダムで手に入る' },
];

export const MILESTONE_STICKERS: StickerCatalogItem[] = [
  { emoji: '🥉', label: '3日連続記念', rarity: 'rare', howToGet: '3日連続で記録すると手に入る' },
  { emoji: '🥈', label: '7日連続記念', rarity: 'rare', howToGet: '7日連続で記録すると手に入る' },
  { emoji: '🥇', label: '30日連続記念', rarity: 'rare', howToGet: '30日連続で記録すると手に入る' },
  { emoji: '👑', label: '100日連続記念', rarity: 'rare', howToGet: '100日連続で記録すると手に入る' },
];

export const ALL_STICKERS: StickerCatalogItem[] = [...COMMON_STICKERS, ...MILESTONE_STICKERS];

const STREAK_MILESTONES: Record<number, string> = {
  3: '🥉',
  7: '🥈',
  30: '🥇',
  100: '👑',
};

export function pickSticker(streakIncludingToday: number): string {
  const milestoneSticker = STREAK_MILESTONES[streakIncludingToday];
  if (milestoneSticker) return milestoneSticker;
  const common = COMMON_STICKERS[Math.floor(Math.random() * COMMON_STICKERS.length)];
  return common.emoji;
}
