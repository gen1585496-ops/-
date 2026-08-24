const COMMON_STICKERS = ['🌱', '🍀', '⭐', '🌸', '🐣', '🎈', '🍉', '🌈', '🦋', '🍩', '🌻', '🔥', '🐚', '🍄'];

const STREAK_MILESTONES: Record<number, string> = {
  3: '🥉',
  7: '🥈',
  30: '🥇',
  100: '👑',
};

export function pickSticker(streakIncludingToday: number): string {
  const milestoneSticker = STREAK_MILESTONES[streakIncludingToday];
  if (milestoneSticker) return milestoneSticker;
  return COMMON_STICKERS[Math.floor(Math.random() * COMMON_STICKERS.length)];
}
