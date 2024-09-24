import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.svg';
import CloseIcon from '@/assets/icons/CloseIcon.svg';
import DoneIcon from '@/assets/icons/DoneIcon.svg';
import useTheme from '@/hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconButton} from '../Buttons';
import MainText from '../MainText';
import {ModalContainerProps} from './types';
import {capitalize} from 'lodash';

const ModalContainer = ({
  title,
  description,
  scrollDisabled,
  style,
  children,
  renderHeader,
  onDonePress,
  DoneButton,
  hideCloseButton,
  showBackButton,
  isDoneButtonEnabled,
  isDoneButtonLoading,
  accessoryView,
  scrollProps,
}: ModalContainerProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const Container = useMemo(() => {
    return scrollDisabled ? View : ScrollView;
  }, [scrollDisabled]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(theme.colors.background2),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          {showBackButton && (
            <View style={{marginLeft: -12}}>
              <IconButton
                icon={ChevronLeftIcon}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          )}

          {!!title && (
            <MainText
              style={{flex: 1}}
              numberOfLines={2}
              weight="semiBold"
              size={32}>
              {capitalize(title)}
            </MainText>
          )}

          {renderHeader != undefined && renderHeader()}
        </View>

        {DoneButton ? (
          DoneButton
        ) : onDonePress != undefined ? (
          isDoneButtonEnabled != undefined ? (
            <IconButton
              isHaptic={isDoneButtonEnabled}
              side={44}
              onPress={onDonePress}
              style={{marginRight: 8}}
              isActive={isDoneButtonEnabled}
              isLoading={isDoneButtonEnabled && isDoneButtonLoading}
              states={[
                {
                  type: 'primary',
                  icon: DoneIcon,
                },
                {type: 'secondary', icon: CloseIcon},
              ]}
            />
          ) : (
            <IconButton
              side={44}
              icon={DoneIcon}
              type="primary"
              onPress={onDonePress}
              style={{marginRight: 8}}
              isLoading={isDoneButtonLoading}
            />
          )
        ) : hideCloseButton ? null : (
          <IconButton
            opacity={0.6}
            icon={CloseIcon}
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
      </View>

      {description != undefined && (
        <View style={{marginLeft: 16, width: '75%'}}>
          <MainText size={16} color={theme.colors.lightText}>
            {description}
          </MainText>
        </View>
      )}

      <Container
        scrollEnabled={!scrollDisabled}
        style={{
          flex: 1,
          marginTop: 12,
          paddingHorizontal: 8,
          ...style,
        }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
        }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        {...scrollProps}
        showsVerticalScrollIndicator={false}>
        {children}
      </Container>

      {accessoryView && (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={70}>
          {accessoryView}
        </KeyboardAvoidingView>
      )}
    </Animated.View>
  );
};

export default ModalContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 8,
    paddingBottom: 8,
  },
});
