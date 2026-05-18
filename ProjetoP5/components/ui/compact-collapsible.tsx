import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function CompactCollapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={() => setIsOpen((v) => !v)} activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={16}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="default">{title}</ThemedText>
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  content: {
    marginLeft: 16,
    marginBottom: 12,
  },
});
