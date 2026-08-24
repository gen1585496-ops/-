import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from './types';

const STORAGE_KEY = '@hibisheel/entries';

export async function getAllEntries(): Promise<Record<string, DiaryEntry>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveEntry(entry: DiaryEntry): Promise<void> {
  const all = await getAllEntries();
  all[entry.date] = entry;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getStreakEndingAt(dateStr: string, entries: Record<string, DiaryEntry>): number {
  let streak = 0;
  const cursor = new Date(`${dateStr}T00:00:00`);
  for (;;) {
    cursor.setDate(cursor.getDate() - 1);
    const key = cursor.toISOString().slice(0, 10);
    if (!entries[key]) break;
    streak += 1;
  }
  return streak;
}

export function getInclusiveStreak(dateStr: string, entries: Record<string, DiaryEntry>): number {
  if (!entries[dateStr]) return 0;
  return getStreakEndingAt(dateStr, entries) + 1;
}
