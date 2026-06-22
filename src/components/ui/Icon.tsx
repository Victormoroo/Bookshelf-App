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
  | 'logout'
  | 'eye'
  | 'eye-off'
  | 'trash'
  | 'chevron-right';

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
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" {...common} />
          <Circle cx={12} cy={12} r={3} {...common} />
        </Svg>
      );
    case 'eye-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            {...common}
          />
          <Path d="M1 1l22 22" {...common} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 6h18" {...common} />
          <Path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" {...common} />
          <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" {...common} />
          <Path d="M10 11v6M14 11v6" {...common} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="m9 6 6 6-6 6" {...common} />
        </Svg>
      );
  }
}
