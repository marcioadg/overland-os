import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import type { Campsite } from '../lib/api';

interface CampsiteCardProps {
  campsite: Campsite;
}

const TYPE_COLORS: Record<string, string> = {
  BLM: '#D97706',
  NFS: '#16A34A',
  Recreation: '#2563EB',
};

export function CampsiteCard({ campsite }: CampsiteCardProps) {
  const openInMaps = () => {
    const { latitude, longitude, name } = campsite;
    const label = encodeURIComponent(name);
    const url =
      Platform.OS === 'ios'
        ? `maps:?q=${label}&ll=${latitude},${longitude}`
        : `geo:${latitude},${longitude}?q=${label}`;
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      );
    });
  };

  const typeColor = TYPE_COLORS[campsite.type] ?? Colors.accent;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {campsite.name}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[styles.typeText, { color: typeColor }]}>{campsite.type}</Text>
          </View>
        </View>
        {campsite.facilityName ? (
          <Text style={styles.facility}>{campsite.facilityName}</Text>
        ) : null}
      </View>

      <View style={styles.meta}>
        <View style={styles.badges}>
          {campsite.isFree && (
            <View style={[styles.badge, styles.freeBadge]}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}
          {campsite.hasWater && (
            <View style={[styles.badge, styles.waterBadge]}>
              <Text style={styles.waterText}>💧 Water</Text>
            </View>
          )}
          {campsite.isDispersed && (
            <View style={[styles.badge, styles.dispersedBadge]}>
              <Text style={styles.dispersedText}>Dispersed</Text>
            </View>
          )}
        </View>

        <Text style={styles.coords}>
          {campsite.latitude.toFixed(4)}, {campsite.longitude.toFixed(4)}
        </Text>
      </View>

      {campsite.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {campsite.description}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.mapsButton}
        onPress={openInMaps}
        activeOpacity={0.8}
      >
        <Text style={styles.mapsButtonText}>📍 Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  facility: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeBadge: {
    backgroundColor: '#166534',
  },
  freeText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '700',
  },
  waterBadge: {
    backgroundColor: '#1E3A5F',
  },
  waterText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '600',
  },
  dispersedBadge: {
    backgroundColor: '#3B1E00',
  },
  dispersedText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '600',
  },
  coords: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  mapsButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  mapsButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
