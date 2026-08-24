import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme';
import { DiaryEntry } from '../types';
import { getAllEntries } from '../storage';
import { moodLabel } from '../moods';

export default function CalendarScreen() {
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});
  const [selected, setSelected] = useState<DiaryEntry | null>(null);

  const load = useCallback(() => {
    getAllEntries().then(setEntries);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ステッカー帳</Text>
      <Text style={styles.subheading}>記録できた日に、その日のステッカーが貼られます</Text>

      <Calendar
        firstDay={1}
        theme={{
          backgroundColor: colors.paper,
          calendarBackground: colors.paper,
          textSectionTitleColor: colors.inkFaint,
          monthTextColor: colors.ink,
          arrowColor: colors.teal,
          textMonthFontWeight: '700',
          textDayHeaderFontSize: 11,
        }}
        dayComponent={({ date, state, onPress }) => {
          if (!date) return <View style={styles.dayCell} />;
          const entry = entries[date.dateString];
          const isToday = state === 'today';
          const isOtherMonth = state === 'disabled';
          return (
            <Pressable
              style={styles.dayCell}
              onPress={() => onPress?.(date)}
              disabled={isOtherMonth}
            >
              <View style={[styles.dayNumberWrap, isToday && styles.dayNumberWrapToday]}>
                <Text
                  style={[
                    styles.dayNumber,
                    isOtherMonth && styles.dayNumberDim,
                    isToday && styles.dayNumberToday,
                  ]}
                >
                  {date.day}
                </Text>
              </View>
              {entry ? (
                <Text style={styles.sticker}>{entry.sticker}</Text>
              ) : (
                <View style={styles.stickerEmpty} />
              )}
            </Pressable>
          );
        }}
        onDayPress={(day) => {
          const entry = entries[day.dateString];
          if (entry) setSelected(entry);
        }}
      />

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selected && (
              <ScrollView>
                <Text style={styles.modalDate}>{selected.date}</Text>
                <Text style={styles.modalSticker}>{selected.sticker}</Text>
                <Text style={styles.modalMood}>気分：{moodLabel(selected.mood)}</Text>
                <Text style={styles.modalText}>{selected.text}</Text>
              </ScrollView>
            )}
            <Pressable style={styles.closeButton} onPress={() => setSelected(null)}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const DAY_CELL_SIZE = 42;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingTop: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: colors.ink, marginHorizontal: 20 },
  subheading: { fontSize: 12, color: colors.inkFaint, marginHorizontal: 20, marginTop: 4, marginBottom: 8 },
  dayCell: { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE + 6, alignItems: 'center', justifyContent: 'flex-start' },
  dayNumberWrap: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dayNumberWrapToday: { backgroundColor: colors.tealBg },
  dayNumber: { fontSize: 13, color: colors.ink },
  dayNumberDim: { color: colors.inkFaint },
  dayNumberToday: { color: colors.teal, fontWeight: '700' },
  sticker: { fontSize: 16, marginTop: 2 },
  stickerEmpty: { width: 16, height: 16, marginTop: 2 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(43,42,38,0.45)', justifyContent: 'center', padding: 24 },
  modalCard: {
    backgroundColor: colors.paperRaised,
    borderRadius: 14,
    padding: 20,
    maxHeight: '70%',
  },
  modalDate: { fontSize: 13, color: colors.inkFaint, fontWeight: '600', marginBottom: 8 },
  modalSticker: { fontSize: 48, marginBottom: 8 },
  modalMood: { fontSize: 13, color: colors.inkSoft, marginBottom: 12 },
  modalText: { fontSize: 15, color: colors.ink, lineHeight: 23 },
  closeButton: { marginTop: 16, alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 16 },
  closeButtonText: { color: colors.teal, fontWeight: '700' },
});
