import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme';
import { DiaryEntry, Mood } from '../types';
import { MOODS, moodLabel } from '../moods';
import { getAllEntries, getStreakEndingAt, saveEntry } from '../storage';
import { pickSticker } from '../stickers';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeScreen() {
  const today = useMemo(todayString, []);
  const [entry, setEntry] = useState<DiaryEntry | null | undefined>(undefined);
  const [text, setText] = useState('');
  const [mood, setMood] = useState<Mood>('okay');

  useEffect(() => {
    getAllEntries().then((all) => setEntry(all[today] ?? null));
  }, [today]);

  async function handleSave() {
    if (!text.trim()) {
      Alert.alert('日記を書いてから保存してください');
      return;
    }
    const all = await getAllEntries();
    const streak = getStreakEndingAt(today, all) + 1;
    const sticker = pickSticker(streak);
    const newEntry: DiaryEntry = {
      date: today,
      text: text.trim(),
      mood,
      sticker,
      createdAt: new Date().toISOString(),
    };
    await saveEntry(newEntry);
    setEntry(newEntry);
    Alert.alert('記録できました', `今日のステッカーを獲得: ${sticker}`);
  }

  if (entry === undefined) {
    return <View style={styles.container} />;
  }

  if (entry) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{today}・記録済み</Text>
        <Text style={styles.stickerBig}>{entry.sticker}</Text>
        <Text style={styles.moodLine}>気分：{moodLabel(entry.mood)}</Text>
        <Text style={styles.entryText}>{entry.text}</Text>
        <Text style={styles.hint}>今日の分は保存済みです。続きはカレンダーから見返せます。</Text>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>{today}</Text>
        <Text style={styles.title}>今日の記録</Text>

        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => setMood(m.key)}
              style={[styles.moodButton, mood === m.key && styles.moodButtonActive]}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, mood === m.key && styles.moodLabelActive]}>
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="今日はどんな一日でしたか？"
          placeholderTextColor={colors.inkFaint}
          value={text}
          onChangeText={setText}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>記録してステッカーをもらう</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 13, color: colors.inkFaint, fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: 20 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.paperLine,
  },
  moodButtonActive: { borderColor: colors.teal, backgroundColor: colors.tealBg },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 11, color: colors.inkFaint, marginTop: 4 },
  moodLabelActive: { color: colors.teal, fontWeight: '700' },
  input: {
    minHeight: 160,
    backgroundColor: colors.paperRaised,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.paperLine,
    padding: 14,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  stickerBig: { fontSize: 64, marginBottom: 12 },
  moodLine: { fontSize: 14, color: colors.inkSoft, marginBottom: 16 },
  entryText: { fontSize: 15, color: colors.ink, lineHeight: 24 },
  hint: { marginTop: 24, fontSize: 12, color: colors.inkFaint },
});
