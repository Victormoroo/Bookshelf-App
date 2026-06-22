/**
 * Line icons transcribed from the prototype's inline SVGs so the nav and
 * controls match the design exactly.
 */
import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export type IconName =
  | 'shelf'
  | 'libraries'
  | 'search'
  | 'profile'
  | 'settings'
  | 'logout';

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color, strokeWidth = 1.8 }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  switch (name) {
    case 'shelf':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 5v15" {...common} />
          <Path d="M8.5 5v15" {...common} />
          <Path d="m13.5 6 4.2 14" {...common} />
          <Path d="M4 20h16" {...common} />
        </Svg>
      );
    case 'libraries':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" {...common} />
          <Path d="M3 12 12 16.5 21 12" {...common} />
          <Path d="M3 16.5 12 21 21 16.5" {...common} />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={11} cy={11} r={7} {...common} />
          <Path d="m20 20-3.5-3.5" {...common} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={8} r={4} {...common} />
          <Path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" {...common} />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={4} y1={8} x2={20} y2={8} {...common} />
          <Line x1={4} y1={16} x2={20} y2={16} {...common} />
          <Circle cx={10} cy={8} r={2.6} {...common} />
          <Circle cx={15} cy={16} r={2.6} {...common} />
        </Svg>
      );
    case 'logout':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} />
          <Path d="m16 17 5-5-5-5" {...common} />
          <Path d="M21 12H9" {...common} />
        </Svg>
      );
  }
}
