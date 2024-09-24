import AuthAPI from '@/api/routes/auth';
import {CreateTokenResponse} from '@/api/types/auth';
import Logo from '@/assets/Logo.svg';
import {FadeAnimatedView} from '@/components/Animations';
import {SocialLoginButton} from '@/components/Buttons';
import LoaderOverlayView from '@/components/Loader/LoaderView';
import MainText from '@/components/MainText';
import RouteNames from '@/constants/routeNames';
import {
  setDefaultSettings,
  setUserProfile,
} from '@/storage/slices/profileSlice';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StatusBar, Text, View} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styles from './styles';

const TERMS_URL = 'https://www.google.com';
const PRIVACY_URL = 'https://www.apple.com';

const Login = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebBrowser.WebBrowserResult | null>(
    null,
  );

  const onLinkPress = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });

    setResult(result);
  };

  const signInCallback = (responseData: CreateTokenResponse) => {
    if (responseData != null) {
      const isFirstLogin = responseData.user.is_created;

      dispatch(setUserProfile(responseData));

      if (isFirstLogin) {
        navigation.navigate(RouteNames.Onboarding);
      } else {
        navigation.navigate(RouteNames.Root);
      }
    } else {
      setIsLoading(false);
    }
  };

  const onLoginPress = (type: string) => {
    setIsLoading(true);

    if (type === 'google') {
      AuthAPI.google(signInCallback);
    } else {
      AuthAPI.apple(signInCallback);
    }
  };

  /* Effects */

  useEffect(() => {
    /* Invoke this function to setup profile default settings */
    dispatch(setDefaultSettings());
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <Animated.View entering={FadeIn}>
          <View style={styles.content}>
            <Image
              style={styles.bgImage}
              source={require('@/assets/pictures/login9.jpg')}
            />

            <LinearGradient
              colors={['transparent', 'black']}
              style={styles.gradient}
            />
          </View>

          <View style={[styles.content2, {paddingBottom: insets.bottom + 24}]}>
            <View style={styles.logo}>
              <View style={{width: 80, height: 80}}>
                <Logo />
              </View>

              <View style={{marginTop: 16, paddingHorizontal: 16}}>
                <MainText color="#fff" align="center" size={18}>
                  Enhance learning,{'\n'}refine thinking.
                </MainText>
              </View>
            </View>

            <FadeAnimatedView mode="fade">
              <View style={{gap: 16, marginBottom: 8}}>
                <SocialLoginButton type="google" onPress={onLoginPress} />
                <SocialLoginButton type="apple" onPress={onLoginPress} />
              </View>

              <View style={{marginTop: 20, paddingHorizontal: 16}}>
                <Hyperlink
                  onPress={onLinkPress}
                  linkText={url => {
                    if (url === TERMS_URL) {
                      return t('Common:termsOfService');
                    }

                    return t('Common:privacyPolicy');
                  }}
                  injectViewProps={_ => ({
                    style: {textDecorationLine: 'underline'},
                  })}>
                  <MainText
                    align="center"
                    size={12}
                    color={'rgba(255,255,255,0.5)'}>
                    {t('Login:bySigningIn')} {TERMS_URL} {t('Login:and')}{' '}
                    {PRIVACY_URL}.
                  </MainText>
                </Hyperlink>

                <Text style={{position: 'absolute'}}>
                  {result && result.type != 'cancel' && JSON.stringify(result)}
                </Text>
              </View>
            </FadeAnimatedView>
          </View>
        </Animated.View>
      </View>

      <LoaderOverlayView isVisible={isLoading} />
    </>
  );
};

export default Login;
