import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useChecklists } from '../../hooks/useChecklists';

interface QuickActionProps {
  emoji: string;
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

function QuickAction({ emoji, label, subtitle, color, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity style={[styles.actionCard, { borderColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIcon, { backgroundColor: color + '22' }]}>
        <Text style={styles.actionEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { checklists, getProgress } = useChecklists();

  const totalItems = checklists.reduce((acc, c) => acc + c.items.length, 0);
  const checkedItems = checklists.reduce(
    (acc, c) => acc + c.items.filter((i) => i.checked).length,
    0
  );
  const overallProgress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const email = user?.email ?? 'Overlander';
  const firstName = email.split('@')[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroGreeting}>Hey, {firstName} 🤙</Text>
        <Text style={styles.heroSub}>Ready to head off-grid?</Text>

        <View style={styles.statsRow}>
          <StatCard label="Checklists" value={String(checklists.length)} />
          <StatCard label="Items Ready" value={`${overallProgress}%`} color={Colors.accent} />
          <StatCard label="Gear Items" value={String(totalItems)} />
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <QuickAction
          emoji="✅"
          label="Checklists"
          subtitle="Gear & vehicle prep"
          color={Colors.accent}
          onPress={() => router.push('/(tabs)/checklists')}
        />
        <QuickAction
          emoji="🗺"
          label="Find Camp"
          subtitle="BLM & Recreation spots"
          color="#3B82F6"
          onPress={() => router.push('/(tabs)/search')}
        />
        <QuickAction
          emoji="🏕"
          label="BLM Spots"
          subtitle="10 free dispersed sites"
          color="#16A34A"
          onPress={() => router.push('/(tabs)/search')}
        />
        <QuickAction
          emoji="⚙️"
          label="Profile"
          subtitle="Settings & account"
          color="#8B5CF6"
          onPress={() => router.push('/(tabs)/profile')}
        />
      </View>

      {/* Recent Checklists */}
      {checklists.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Checklists</Text>
          {checklists.slice(0, 3).map((cl) => {
            const prog = getProgress(cl);
            const pct = Math.round(prog * 100);
            return (
              <TouchableOpacity
                key={cl.id}
                style={styles.recentCard}
                onPress={() => router.push('/(tabs)/checklists')}
                activeOpacity={0.8}
              >
                <View style={styles.recentLeft}>
                  <Text style={styles.recentName}>{cl.name}</Text>
                  <Text style={styles.recentSub}>
                    {cl.items.filter((i) => i.checked).length}/{cl.items.length} items · {pct}%
                  </Text>
                </View>
                <View style={styles.recentProgress}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${pct}%`, backgroundColor: pct === 100 ? Colors.success : Colors.accent },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      {checklists.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛻</Text>
          <Text style={styles.emptyTitle}>No checklists yet</Text>
          <Text style={styles.emptySub}>Start with the Cybertruck RTT template</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/checklists')}
          >
            <Text style={styles.emptyBtnText}>Create First Checklist</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer tip */}
      <View style={styles.tip}>
        <Text style={styles.tipText}>
          🔒 Leave No Trace · Pack In, Pack Out · Respect the Land
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: Colors.card,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 4,
  },
  heroGreeting: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  heroSub: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  actionSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  recentCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  recentLeft: {
    flex: 1,
    gap: 2,
  },
  recentName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  recentSub: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  recentProgress: {
    width: 60,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  tip: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 14,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tipText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
