import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { DiaryEntry } from '../types';
import { getAllEntries } from '../storage';
import { moodTrend, summarizeMonth, moodScoreLabel, TrendPoint } from '../analysis';

const TREND_DAYS = 30;
const CHART_HEIGHT = 72;

export default function AnalysisScreen() {
  const [entries, setEntries] = useState<Record<string, DiaryEntry> | null>(null);

  useEffect(() => {
    getAllEntries().then(setEntries);
  }, []);

  if (!entries) return <View style={styles.container} />;

  const hasAny = Object.keys(entries).length > 0;
  const trend = moodTrend(entries, TREND_DAYS);
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const summary = summarizeMonth(entries, currentYearMonth);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>分析レポート</Text>

      {!hasAny ? (
        <Text style={styles.empty}>記録がまだありません。日記を書くと、ここに傾向が表示されます。</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>気分の推移（直近{TREND_DAYS}日）</Text>
            <MoodChart trend={trend} />
            <View style={styles.legend}>
              <Text style={styles.legendText}>😄 最高</Text>
              <Text style={styles.legendText}>😐 ふつう</Text>
              <Text style={styles.legendText}>😣 つらい</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>今月のサマリー</Text>
            <Text style={styles.summaryText}>{summary.text}</Text>
            {summary.avgScore !== null && (
              <Text style={styles.summaryMeta}>
                平均的な気分：{moodScoreLabel(summary.avgScore)}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>よく出てきた言葉（今月）</Text>
            {summary.keywords.length === 0 ? (
              <Text style={styles.emptySmall}>まだ十分な記録がありません。</Text>
            ) : (
              <View style={styles.keywordRow}>
                {summary.keywords.map((k) => (
                  <View key={k.word} style={styles.keywordChip}>
                    <Text style={styles.keywordText}>{k.word}</Text>
                    <Text style={styles.keywordCount}>{k.count}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.footnote}>
              簡易的な文字の出現頻度による分析です。より精度の高い分析（LLMによる要約など）は今後実装予定です。
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function MoodChart({ trend }: { trend: TrendPoint[] }) {
  return (
    <View style={styles.chart}>
      {trend.map((point) => {
        const hasData = point.score !== null;
        const ratio = hasData ? (point.score! + 2) / 4 : 0;
        const barHeight = Math.max(hasData ? ratio * CHART_HEIGHT : 3, 3);
        const color = !hasData
          ? colors.paperLine
          : point.score! > 0
            ? colors.teal
            : point.score! < 0
              ? colors.coral
              : colors.mustard;
        return (
          <View key={point.date} style={styles.barTrack}>
            <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 16 },
  empty: { fontSize: 13, color: colors.inkFaint },
  emptySmall: { fontSize: 12, color: colors.inkFaint },
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paperLine,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: colors.inkSoft, marginBottom: 12 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 2,
  },
  barTrack: { flex: 1, height: CHART_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 2 },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  legendText: { fontSize: 10, color: colors.inkFaint },
  summaryText: { fontSize: 14, color: colors.ink, lineHeight: 22, marginBottom: 8 },
  summaryMeta: { fontSize: 12, color: colors.inkFaint },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.tealBg,
  },
  keywordText: { fontSize: 13, color: colors.teal, fontWeight: '700' },
  keywordCount: { fontSize: 11, color: colors.teal, opacity: 0.7 },
  footnote: { fontSize: 10, color: colors.inkFaint, lineHeight: 15 },
});
