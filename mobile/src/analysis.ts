import { DiaryEntry, Mood } from './types';

export const MOOD_SCORE: Record<Mood, number> = {
  great: 2,
  good: 1,
  okay: 0,
  bad: -1,
  awful: -2,
};

export interface TrendPoint {
  date: string;
  score: number | null;
}

export function moodTrend(entries: Record<string, DiaryEntry>, days: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = entries[key];
    points.push({ date: key, score: entry ? MOOD_SCORE[entry.mood] : null });
    cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}

export function averageMood(entries: DiaryEntry[]): number | null {
  if (entries.length === 0) return null;
  const total = entries.reduce((sum, e) => sum + MOOD_SCORE[e.mood], 0);
  return total / entries.length;
}

export function moodScoreLabel(score: number): string {
  if (score >= 1.5) return '最高';
  if (score >= 0.5) return '良い';
  if (score >= -0.5) return 'ふつう';
  if (score >= -1.5) return 'いまいち';
  return 'つらい';
}

// A lightweight, fully local keyword heuristic: since Japanese text has no
// spaces, proper tokenization needs a morphological analyzer we don't have
// offline. Character bigrams are a common cheap substitute that still
// surfaces real compound words (e.g. "仕事", "散歩") often enough for a
// rough-cut MVP. This is not the LLM-based analysis described as Phase 4.
const STOPWORD_BIGRAMS = new Set([
  'した', 'して', 'ます', 'です', 'だっ', 'ある', 'いる', 'この', 'その',
  'あの', 'こと', 'もの', 'ので', 'から', 'けど', 'だが', 'しか', 'まで',
  'とき', 'ため', 'よう', 'そう', 'なる', 'なっ', 'れる', 'られ', 'てい',
  'ていた', 'という', 'んだ', 'んな', 'だと', 'には', 'では', 'にも',
  'った', 'かっ', 'えた', 'いた', 'きた', 'たり', 'たら', 'ても', 'でも',
  'ない', 'なく', 'まし', 'てき', 'てし', 'せた', 'れた', 'られた',
]);

const STRIP_PATTERN = /[\s、。！？「」『』（）()・…,.!?~〜\d0-9a-zA-Z]/g;

export interface KeywordCount {
  word: string;
  count: number;
}

export function topKeywords(entries: DiaryEntry[], limit: number): KeywordCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const cleaned = entry.text.replace(STRIP_PATTERN, '');
    for (let i = 0; i < cleaned.length - 1; i++) {
      const bigram = cleaned.slice(i, i + 2);
      if (STOPWORD_BIGRAMS.has(bigram)) continue;
      counts.set(bigram, (counts.get(bigram) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export interface MonthlySummary {
  yearMonth: string;
  recordedDays: number;
  totalDaysSoFar: number;
  avgScore: number | null;
  keywords: KeywordCount[];
  text: string;
}

export function summarizeMonth(entries: Record<string, DiaryEntry>, yearMonth: string): MonthlySummary {
  const monthEntries = Object.values(entries).filter((e) => e.date.startsWith(yearMonth));
  const avg = averageMood(monthEntries);
  const keywords = topKeywords(monthEntries, 5);

  const now = new Date();
  const currentYearMonth = now.toISOString().slice(0, 7);
  const totalDaysSoFar =
    yearMonth === currentYearMonth
      ? now.getDate()
      : new Date(Number(yearMonth.slice(0, 4)), Number(yearMonth.slice(5, 7)), 0).getDate();

  const text = buildSummaryText(monthEntries.length, totalDaysSoFar, avg, keywords);

  return {
    yearMonth,
    recordedDays: monthEntries.length,
    totalDaysSoFar,
    avgScore: avg,
    keywords,
    text,
  };
}

function buildSummaryText(
  recordedDays: number,
  totalDaysSoFar: number,
  avgScore: number | null,
  keywords: KeywordCount[],
): string {
  if (recordedDays === 0) {
    return '今月はまだ記録がありません。今日から書き始めてみましょう。';
  }
  const moodPart = avgScore === null ? '' : `気分は全体的に「${moodScoreLabel(avgScore)}」寄りでした。`;
  const keywordPart =
    keywords.length > 0 ? `よく出てきた言葉は「${keywords.map((k) => k.word).join('」「')}」でした。` : '';
  return `今月は${totalDaysSoFar}日中${recordedDays}日記録できました。${moodPart}${keywordPart}`.trim();
}
