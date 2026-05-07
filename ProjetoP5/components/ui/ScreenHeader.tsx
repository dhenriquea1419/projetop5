import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  variant?: 'centered' | 'left-aligned';
}

export function ScreenHeader({
  title,
  subtitle,
  icon = '⚕️',
  variant = 'centered',
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, variant === 'left-aligned' && styles.headerLeftAligned]}>
      <View
        style={[
          styles.titleRow,
          variant === 'left-aligned' && styles.titleRowLeftAligned,
        ]}
      >
        <Text style={styles.symbol}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, variant === 'left-aligned' && styles.subtitleLeftAligned]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#14838d',
    paddingTop: 44,
    paddingBottom: 22,
    paddingHorizontal: 0,
    alignItems: 'center',
    marginHorizontal: -20,
    marginTop: -20,
  },
  headerLeftAligned: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  titleRowLeftAligned: {
    justifyContent: 'flex-start',
  },
  symbol: {
    fontSize: 32,
    marginRight: 10,
    color: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#d7f1f2',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  subtitleLeftAligned: {
    textAlign: 'left',
  },
});
