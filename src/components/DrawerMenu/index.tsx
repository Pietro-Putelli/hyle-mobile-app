import Logo from '@/assets/Logo.svg';
import drawerMenuItems from '@/constants/drawerMenuItems';
import useProfile from '@/hooks/useProfile';
import useTheme from '@/hooks/useTheme';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {capitalize} from 'lodash';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import styles from './styles';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const DrawerMenu = ({navigation}: DrawerContentComponentProps) => {
  const theme = useTheme();
  const {profile, settings} = useProfile();
  const {t} = useTranslation();

  const onMenuItemPress = (route: string) => {
    navigation.navigate(route);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(theme.colors.background),
    };
  });

  const items = useMemo(() => {
    return drawerMenuItems.map((item: any) => {
      return {
        ...item,
        title: capitalize(t('Common:' + item.title)),
      };
    });
  }, [drawerMenuItems, t, settings.appLanguage]);

  return (
    <AnimatedSafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <MainText size={28}>Hey {profile.givenName}</MainText>
      </View>

      <ScrollView
        contentContainerStyle={{paddingTop: 8}}
        style={{paddingHorizontal: 16}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {items.map(item => {
            const Icon = item.icon;

            return (
              <ScaleButton
                activeScale={0.98}
                onPress={() => onMenuItemPress(item.route)}
                style={styles.menuCell}
                key={item.title}>
                <IconProvider Icon={Icon} />
                <MainText size={18} style={{marginLeft: 16, flex: 1}}>
                  {item.title}
                </MainText>
              </ScaleButton>
            );
          })}
        </View>

        <View style={styles.body}>{/* <Paywall /> */}</View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.logo}>
          <Logo />
        </View>

        <MainText style={{flex: 1}} size={14}>
          Not just ink on paper, but a dancing star.
        </MainText>
      </View>
    </AnimatedSafeAreaView>
  );
};

export default DrawerMenu;
