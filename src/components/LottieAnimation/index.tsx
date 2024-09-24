import useTheme from '@/hooks/useTheme';
import LottieView, {LottieViewProps} from 'lottie-react-native';
import React, {useEffect, useMemo, useRef} from 'react';

type LottieAnimationProps = LottieViewProps & {
  isActive: boolean;
  isThemeSensitive?: boolean;
};

export const getAnimationKeypaths = (animations: any) => {
  let keypaths: Set<string> = new Set();

  if (!Array.isArray(animations)) {
    animations.layers.map((l, i) => keypaths.add(l.nm));
  } else {
    animations.map((a, i) => {
      a.layers.map((l, i) => keypaths.add(l.nm));
    });
  }

  return Array.from(keypaths);
};

const LottieAnimation = ({
  isActive,
  source,
  isThemeSensitive,
  ...props
}: LottieAnimationProps) => {
  const ref = useRef<LottieView>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isActive) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
  }, [isActive]);

  const colorFilters = useMemo(() => {
    if (isThemeSensitive) {
      return getAnimationKeypaths(source).map((keypath, i) => ({
        keypath,
        color: theme.colors.text,
      }));
    }
  }, [isThemeSensitive, theme]);

  return (
    <LottieView
      colorFilters={colorFilters}
      source={source}
      ref={ref}
      autoPlay
      loop
      {...props}
    />
  );
};

export default LottieAnimation;
