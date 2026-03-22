import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface ProgressBarProps {
  progress: number; // 0-1
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export function ProgressBar({
  progress,
  showLabel = true,
  height = 8,
  color = Colors.accent,
}: ProgressBarProps) {
  const pct = Math.round(progress * 100);
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress * 100}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>{pct}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    backgroundColor: Colors.cardBorder,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    minWidth: 32,
    textAlign: 'right',
  },
});
