import React, { useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { colors } from './src/theme';

type Tab = 'home' | 'calendar';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ヒビシール</Text>
      </View>
      <View style={styles.body}>{tab === 'home' ? <HomeScreen /> : <CalendarScreen />}</View>
      <View style={styles.tabBar}>
        <TabButton label="今日の記録" active={tab === 'home'} onPress={() => setTab('home')} />
        <TabButton label="カレンダー" active={tab === 'calendar'} onPress={() => setTab('calendar')} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.tabButton} onPress={onPress}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.tabIndicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.ink },
  body: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.paperRaised,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabLabel: { fontSize: 13, color: colors.inkFaint, fontWeight: '600' },
  tabLabelActive: { color: colors.teal },
  tabIndicator: { marginTop: 6, width: 24, height: 3, borderRadius: 2, backgroundColor: colors.teal },
});
