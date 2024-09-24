import useTheme from '@/hooks/useTheme';
import React, {useMemo} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';

interface MainTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  size?: number;
  style?: StyleProp<TextStyle> | undefined;
  italic?: boolean;
  uppercase?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  color?: string;
}

const MainText = ({
  children,
  weight,
  style,
  size = 16,
  uppercase,
  underline,
  align,
  italic,
  letterSpacing,
  color,
  ...props
}: MainTextProps) => {
  const theme = useTheme();

  const fontFamily = useMemo(() => {
    if (italic) {
      return 'Manrope-MediumItalic';
    }

    switch (weight) {
      case 'regular':
        return 'Manrope-Regular';
      case 'medium':
        return 'Manrope-Medium';
      case 'semiBold':
        return 'Manrope-SemiBold';
      case 'bold':
        return 'Manrope-Bold';
      default:
        return 'Manrope-Medium';
    }
  }, [weight, italic]);

  return (
    <Text
      style={[
        {
          color: color ?? theme.colors.text,
          letterSpacing: letterSpacing ?? 0.8,
          fontSize: size,
          fontFamily,
          textTransform: uppercase ? 'uppercase' : 'none',
          textAlign: align,
          textDecorationLine: underline ? 'underline' : 'none',
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

export default MainText;
