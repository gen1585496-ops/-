import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { getAllEntries } from '../storage';
import { ALL_STICKERS, COMMON_STICKERS, MILESTONE_STICKERS, StickerCatalogItem } from '../stickers';

export default function CollectionScreen() {
  const [earned, setEarned] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAllEntries().then((all) => {
      setEarned(new Set(Object.values(all).map((entry) => entry.sticker)));
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>ステッカー図鑑</Text>
      <Text style={styles.count}>{earned.size} / {ALL_STICKERS.length} 種類を収集</Text>

      <Text style={styles.sectionTitle}>コモン</Text>
      <View style={styles.grid}>
        {COMMON_STICKERS.map((item) => (
          <StickerTile key={item.emoji} item={item} earned={earned.has(item.emoji)} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>連続記録ボーナス</Text>
      <View style={styles.grid}>
        {MILESTONE_STICKERS.map((item) => (
          <StickerTile key={item.emoji} item={item} earned={earned.has(item.emoji)} />
        ))}
      </View>
    </ScrollView>
  );
}

function StickerTile({ item, earned }: { item: StickerCatalogItem; earned: boolean }) {
  return (
    <View style={[styles.tile, item.rarity === 'rare' && styles.tileRare, !earned && styles.tileLocked]}>
      {item.rarity === 'rare' && <Text style={styles.rareBadge}>RARE</Text>}
      <Text style={styles.tileEmoji}>{earned ? item.emoji : '？'}</Text>
      <Text style={[styles.tileLabel, !earned && styles.tileLabelLocked]}>
        {earned ? item.label : '未収集'}
      </Text>
      {!earned && <Text style={styles.tileHint}>{item.howToGet}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: '700', color: colors.ink },
  count: { fontSize: 13, color: colors.inkFaint, marginTop: 4, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.inkSoft, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  tile: {
    width: '30%',
    minWidth: 96,
    aspectRatio: 1,
    backgroundColor: colors.paperRaised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paperLine,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tileRare: { borderColor: colors.mustard, borderWidth: 1.5 },
  tileLocked: { opacity: 0.55 },
  rareBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 9,
    fontWeight: '800',
    color: colors.mustard,
    backgroundColor: colors.mustardBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    letterSpacing: 0.3,
  },
  tileEmoji: { fontSize: 30, marginBottom: 6 },
  tileLabel: { fontSize: 11, color: colors.ink, fontWeight: '600', textAlign: 'center' },
  tileLabelLocked: { color: colors.inkFaint },
  tileHint: { fontSize: 9, color: colors.inkFaint, textAlign: 'center', marginTop: 4 },
});
