import {ScaleButton} from '@/components/Buttons';
import useTheme from '@/hooks/useTheme';
import {Skeleton} from 'moti/skeleton';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import Animated, {
  FadeInLeft,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import MainText from '../MainText';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const TopicCell = ({
  topic,
  index,
  isSelected,
  isLast,
  onPress,
  isMocked,
}: any) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const topicTitle = topic.topic;

  const animatedCellStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isSelected ? topic.color : theme.colors.secondaryBackground,
      ),
    };
  });

  const counterStyle = useMemo(() => {
    if (theme.colorScheme == 'dark') {
      return {backgroundColor: '#24242490'};
    }

    return {
      borderColor: theme.colors.hairline,
      borderWidth: 0.9,
    };
  }, [theme]);

  return (
    <Animated.View
      style={{flexDirection: 'row', alignItems: 'center'}}
      entering={FadeInLeft}>
      <ScaleButton
        disableWithoutOpacity={isMocked}
        onPress={onPress}
        isHaptic
        style={[
          styles.cell,
          {marginRight: isLast ? 0 : 12},
          animatedCellStyle,
        ]}>
        <View>
          <Skeleton show={isMocked}>
            <MainText
              uppercase
              weight="semiBold"
              size={14}
              letterSpacing={1.2}
              style={isMocked ? {left: 1, height: 20} : null}>
              {isMocked
                ? 'topic'
                : topicTitle == 'all'
                ? t('Common:all')
                : topic.topic}
            </MainText>
          </Skeleton>
        </View>

        <View style={[styles.cellCounter, counterStyle]}>
          <MainText weight="bold" size={12}>
            {topic.count}
          </MainText>
        </View>
      </ScaleButton>

      {index == 0 && (
        <View
          style={[
            styles.separator,
            {
              backgroundColor: theme.colors.hairline,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

export default TopicCell;
