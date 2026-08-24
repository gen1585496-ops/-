import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme';
import { applyReminderSettings, getReminderSettings, ReminderSettings } from '../reminders';

const TIME_PRESETS = [
  { hour: 8, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 21, minute: 0 },
  { hour: 23, minute: 0 },
];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);

  useEffect(() => {
    getReminderSettings().then(setSettings);
  }, []);

  async function update(next: ReminderSettings) {
    setSettings(next);
    await applyReminderSettings(next);
  }

  if (!settings) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>設定</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>毎日のリマインダー</Text>
            <Text style={styles.rowDesc}>指定した時刻に記録を促す通知を送ります</Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={(enabled) => update({ ...settings, enabled })}
            trackColor={{ false: colors.paperLine, true: colors.tealBg }}
            thumbColor={settings.enabled ? colors.teal : '#fff'}
          />
        </View>

        {settings.enabled && (
          <View style={styles.timeRow}>
            {TIME_PRESETS.map((preset) => {
              const active = preset.hour === settings.hour && preset.minute === settings.minute;
              return (
                <Pressable
                  key={formatTime(preset.hour, preset.minute)}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                  onPress={() => update({ ...settings, hour: preset.hour, minute: preset.minute })}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                    {formatTime(preset.hour, preset.minute)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      {Platform.OS === 'web' && (
        <Text style={styles.note}>
          通知はモバイル端末（iOS / Android）でのみ有効です。ブラウザプレビューでは送信されません。
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 16 },
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paperLine,
    padding: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  rowDesc: { fontSize: 12, color: colors.inkFaint },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.paperLine,
  },
  timeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperLine,
  },
  timeChipActive: { backgroundColor: colors.tealBg, borderColor: colors.teal },
  timeChipText: { fontSize: 13, color: colors.inkSoft, fontVariant: ['tabular-nums'] },
  timeChipTextActive: { color: colors.teal, fontWeight: '700' },
  note: { fontSize: 12, color: colors.inkFaint, marginTop: 16 },
});
