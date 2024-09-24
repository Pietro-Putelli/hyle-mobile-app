import useReachability from '@/hooks/useReachability';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MainText from '../MainText';
import {useTranslation} from 'react-i18next';

const ReachabilityView = () => {
  const height = useSharedValue(0);
  const isReachable = useReachability();
  const {t} = useTranslation();

  useEffect(() => {
    height.value = withTiming(isReachable ? 0 : 50);
  }, [isReachable]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          paddingVertical: isReachable ? 0 : 4,
          marginHorizontal: 8,
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: isReachable ? 12 : 0,
        },
        animatedStyle,
      ]}>
      <View
        style={{
          width: '100%',
          borderRadius: 12,
          backgroundColor: '#F83439',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
          flexDirection: 'row',
          gap: 8,
        }}>
        {!isReachable && <ActivityIndicator color={'#fff'} />}
        <MainText>{t('Common:establishingConnection')}</MainText>
      </View>
    </Animated.View>
  );
};

export default ReachabilityView;
