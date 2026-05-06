import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function ScreenHeader({ title, subtitle, icon = '⚕️' }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.symbol}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#14838d',
    paddingTop: 44,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  },
});
