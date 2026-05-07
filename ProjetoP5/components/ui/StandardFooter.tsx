import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StandardFooterProps {
  appVersion?: string;
  copyrightYear?: number;
  companyName?: string;
}

export function StandardFooter({
  appVersion = 'v1.0.0',
  copyrightYear = new Date().getFullYear(),
  companyName = 'Farmácia Control',
}: StandardFooterProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{companyName} {appVersion}</Text>
      <Text style={styles.footerText}>© {copyrightYear} - Todos os direitos reservados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
