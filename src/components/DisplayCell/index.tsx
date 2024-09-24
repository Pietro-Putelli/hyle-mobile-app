import ChevronRightIcon from '@/assets/icons/ChevronRightIcon.svg';
import ChevronSelectionVerticalIcon from '@/assets/icons/ChevronSelectionVerticalIcon.svg';
import useTheme from '@/hooks/useTheme';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import styles from './styles';
import {DisplayCellProps} from './types';

const DisplayCell = ({
  Icon,
  isFirst,
  isLast,
  title,
  value,
  hasSegue,
  onPress,
  menuConfig,
  onChange,
  isLoading,
  titleStyle,
  disabled,
  backgroundColor,
  onPressMenuOption,
}: DisplayCellProps) => {
  const theme = useTheme();

  const isPressable = onPress !== undefined;
  const hasMenu = menuConfig !== undefined;

  const style = useMemo(() => {
    return {
      borderTopLeftRadius: isFirst ? 16 : 0,
      borderTopRightRadius: isFirst ? 16 : 0,
      borderBottomLeftRadius: isLast ? 16 : 0,
      borderBottomRightRadius: isLast ? 16 : 0,
      borderTopWidth: isFirst ? 0 : StyleSheet.hairlineWidth,
    };
  }, [isFirst, isLast]);

  const Container: React.ComponentType<any> = useMemo(() => {
    if (hasMenu) {
      return ContextMenuButton;
    }

    if (isPressable) {
      return TouchableOpacity;
    }

    return View;
  }, [isPressable, hasMenu]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        backgroundColor ?? theme.colors.secondaryBackground,
      ),
    };
  });

  const onPressMenuItem = ({nativeEvent}: any) => {
    onPressMenuOption?.(nativeEvent.actionKey);
  };

  const containerStyle = useMemo(() => {
    if (disabled) {
      return {
        opacity: 0.5,
      };
    }
    return {};
  }, [disabled]);

  return (
    <Container
      menuConfig={menuConfig}
      activeOpacity={0.7}
      onPress={onPress}
      onPressMenuItem={onPressMenuItem}>
      <Animated.View
        style={[
          theme.styles.cell,
          style,
          styles.cell,
          !isFirst && theme.styles.hairlineTop,
          animatedStyle,
          containerStyle,
        ]}>
        {Icon && (
          <View style={styles.icon}>
            <IconProvider Icon={Icon} />
          </View>
        )}

        <MainText
          numberOfLines={1}
          style={{flex: 1, marginRight: 16}}
          {...titleStyle}>
          {title}
        </MainText>

        {value && (
          <MainText
            style={{marginRight: hasSegue || hasMenu ? 12 : 0}}
            numberOfLines={1}
            size={15}
            color={theme.colors.lightText}>
            {value}
          </MainText>
        )}

        {isLoading != undefined && (
          <ActivityIndicator
            style={{marginLeft: 12}}
            animating={isLoading}
            color={theme.colors.lightText}
          />
        )}

        {onChange != undefined && (
          <Switch
            disabled={disabled}
            value={value as boolean}
            trackColor={{
              false: theme.colors.lightText,
              true: theme.colors.accent,
            }}
            onValueChange={onChange}
          />
        )}
        {hasSegue && (
          <View style={styles.segue}>
            <IconProvider Icon={ChevronRightIcon} />
          </View>
        )}
        {hasMenu && (
          <View style={styles.menuIcon}>
            <IconProvider Icon={ChevronSelectionVerticalIcon} />
          </View>
        )}
      </Animated.View>
    </Container>
  );
};

export default DisplayCell;
