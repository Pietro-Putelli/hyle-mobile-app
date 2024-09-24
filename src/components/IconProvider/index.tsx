import useTheme from '@/hooks/useTheme';
import React from 'react';

const IconProvider = ({color, scale = 1, style, Icon}: any) => {
  const theme = useTheme();

  return (
    <Icon
      style={{
        color: color ?? theme.colors.text,
        transform: [{scale}],
        ...style,
      }}
    />
  );
};

export default IconProvider;
