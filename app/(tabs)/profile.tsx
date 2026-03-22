import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useChecklists } from '../../hooks/useChecklists';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingRow({ label, onPress, destructive = false }: { label: string; onPress: () => void; destructive?: boolean }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.settingLabel, destructive && styles.destructive]}>{label}</Text>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { checklists, getProgress } = useChecklists();
  const [signingOut, setSigningOut] = useState(false);

  const totalItems = checklists.reduce((acc, c) => acc + c.items.length, 0);
  const checkedItems = checklists.reduce(
    (acc, c) => acc + c.items.filter((i) => i.checked).length,
    0
  );
  const avgProgress =
    checklists.length > 0
      ? Math.round(
          checklists.reduce((acc, c) => acc + getProgress(c), 0) / checklists.length * 100
        )
      : 0;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
          } catch {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  const avatar = (user?.email ?? 'O')[0].toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
        <Text style={styles.email}>{user?.email ?? 'Overlander'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🏕 Overland Member</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.card}>
          <InfoRow label="Checklists" value={String(checklists.length)} />
          <View style={styles.divider} />
          <InfoRow label="Total Gear Items" value={String(totalItems)} />
          <View style={styles.divider} />
          <InfoRow label="Items Checked" value={String(checkedItems)} />
          <View style={styles.divider} />
          <InfoRow label="Avg. Readiness" value={`${avgProgress}%`} />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <InfoRow label="Email" value={user?.email ?? '—'} />
          <View style={styles.divider} />
          <InfoRow label="User ID" value={user?.id?.slice(0, 12) ?? '—'} />
          <View style={styles.divider} />
          <InfoRow
            label="Joined"
            value={
              user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : '—'
            }
          />
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <SettingRow
            label="About OverlandOS"
            onPress={() =>
              Alert.alert(
                'OverlandOS',
                'Version 1.0.0\n\nBuilt for overlanders who refuse to be under-prepared.',
                [{ text: 'OK' }]
              )
            }
          />
          <View style={styles.divider} />
          <SettingRow
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally and on Supabase.')}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Clear Local Data"
            destructive
            onPress={() =>
              Alert.alert(
                'Clear Data',
                'This will delete all local checklists. Supabase data is unaffected.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => {} },
                ]
              )
            }
          />
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutBtn, signingOut && styles.signOutDisabled]}
        onPress={handleSignOut}
        disabled={signingOut}
        activeOpacity={0.8}
      >
        {signingOut ? (
          <ActivityIndicator size="small" color={Colors.text} />
        ) : (
          <Text style={styles.signOutText}>Sign Out</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.version}>OverlandOS v1.0.0 · Built for the trail</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '800',
  },
  email: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: Colors.accent + '22',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  settingLabel: {
    color: Colors.text,
    fontSize: 14,
  },
  settingArrow: {
    color: Colors.textMuted,
    fontSize: 20,
  },
  destructive: {
    color: Colors.error,
  },
  signOutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#7F1D1D',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  signOutDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 24,
  },
});
