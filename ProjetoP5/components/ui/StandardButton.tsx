import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface StandardButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function StandardButton({
  text,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: StandardButtonProps) {
  const buttonStyle =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'secondary'
        ? styles.buttonSecondary
        : styles.buttonDanger;

  const textStyle_ =
    variant === 'primary'
      ? styles.buttonTextPrimary
      : variant === 'secondary'
        ? styles.buttonTextSecondary
        : styles.buttonTextDanger;

  return (
    <TouchableOpacity
      style={[buttonStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[textStyle_, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: '#14838d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#14838d',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#14838d',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDanger: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
