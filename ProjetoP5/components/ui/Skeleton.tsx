import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
  width?: number | string;
  height?: number;
  style?: any;
  children?: React.ReactNode;
};

export default function Skeleton({ width = '100%', height = 16, style, children }: Props) {
  return (
    <SkeletonPlaceholder>
      <View style={[{ width, height, borderRadius: 6 }, style]}>{children}</View>
    </SkeletonPlaceholder>
  );
}
