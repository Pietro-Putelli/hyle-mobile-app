import {ProfileAPI} from '@/api/routes';
import {MiddlewareDispatch} from '@/api/types';
import LogoutIcon from '@/assets/icons/LogoutIcon.svg';
import {ScaleButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import DisplayCell from '@/components/DisplayCell';
import SeparatorTitle from '@/components/DisplayCell/SeparatorTitle';
import LoaderOverlayView from '@/components/Loader/LoaderView';
import MainText from '@/components/MainText';
import getAvailableLanguages from '@/constants/availableLanguages';
import RouteNames from '@/constants/routeNames';
import useProfile from '@/hooks/useProfile';
import useSettings from '@/hooks/useSettings';
import useTheme from '@/hooks/useTheme';
import NotificationSettingsModal from '@/modals/NotificationSettingsModal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as StoreReview from 'expo-store-review';
import * as WebBrowser from 'expo-web-browser';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StatusBar, Text, View} from 'react-native';
import {MenuConfig} from 'react-native-ios-context-menu';
import {useDispatch} from 'react-redux';
import {appearanceMenuConfig} from './options';
import styles from './styles';

const APPEARANCES: Record<string, string> = {light: 'Perla', dark: 'Graphite'};

const Settings = () => {
  const theme = useTheme();
  const dispatch: MiddlewareDispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [webBrowser, setWebBrowser] =
    useState<WebBrowser.WebBrowserResult | null>(null);

  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    colorScheme,
    changeColorScheme,
    changeLanguage,
    setSettings,
    ...settings
  } = useSettings();

  const {profile} = useProfile();

  const availableLanguages = getAvailableLanguages(t);

  const appLanguage = availableLanguages.find(
    language => language.locale === settings.appLanguage,
  );

  const translationLanguage = availableLanguages.find(
    language => language.locale === settings.secondLanguage,
  );

  const languageMenuConfig: MenuConfig = useMemo(() => {
    return {
      menuTitle: '',
      menuItems: availableLanguages.slice(0, 2).map(language => {
        return {
          actionKey: language.locale,
          actionTitle: `${language.flag}  ${language.name}`,
        };
      }),
    };
  }, [settings]);

  const translationLanguageMenuConfig: MenuConfig = useMemo(() => {
    return {
      menuTitle: '',
      menuItems: availableLanguages.map(language => {
        return {
          actionKey: language.locale,
          actionTitle: `${language.flag}  ${language.name}`,
        };
      }),
    };
  }, [settings]);

  const openWebBrowser = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });

    setWebBrowser(result);
  };

  return (
    <>
      <ModalContainer title={t('Common:settings')}>
        <StatusBar barStyle={'light-content'} />

        <View style={{paddingHorizontal: 8}}>
          <SeparatorTitle title="Account" />

          <DisplayCell title="Email" value={profile.email} isFirst isLast />
          {/* <DisplayCell
            title="Subscription"
            value={isPremium ? 'Pro' : 'Free'}
          /> */}
          {/* <DisplayCell
            isLoading={isRestoringPurchase}
            title="Restore purchases"
            isLast={isPremium}
            onPress={() => {
              restorePurchases();
            }}
          /> */}

          {/* {!isPremium && (
            <DisplayCell
              titleStyle={{
                color: '#5113a1',
                weight: 'semiBold',
              }}
              title="Upgrade to premium"
              onPress={() => {
                navigation.navigate(RouteNames.Paywall);
              }}
              isLast
              Icon={UpgradeIcon}
            />
          )} */}

          <SeparatorTitle title="App" hasSpacing />

          <DisplayCell
            title={t('Common:appearance')}
            isFirst
            menuConfig={appearanceMenuConfig}
            value={APPEARANCES[colorScheme]}
            onPressMenuOption={colorScheme => {
              changeColorScheme(colorScheme);
            }}
          />

          {/* <DisplayCell
          title="Reader voice"
          value={settings.readerVoice}
          menuConfig={voiceMenuConfig}
          onPressMenuOption={voice => {
            setSettings({readerVoice: voice});
          }}
        /> */}

          <DisplayCell
            title={t('Common:appLanguage')}
            value={appLanguage?.name}
            menuConfig={languageMenuConfig}
            onPressMenuOption={language => {
              changeLanguage({appLanguage: language});
            }}
          />

          <DisplayCell
            title={t('Common:translationLanguage')}
            value={translationLanguage?.name}
            menuConfig={translationLanguageMenuConfig}
            onPressMenuOption={language => {
              changeLanguage({secondLanguage: language});
            }}
          />

          <DisplayCell
            isLast
            title={t('Common:pushNotifications')}
            hasSegue
            onPress={() => {
              setNotificationVisible(true);
            }}
          />

          <SeparatorTitle title="About" hasSpacing />

          <DisplayCell
            title={t('Common:support')}
            isFirst
            hasSegue
            onPress={() => {
              openWebBrowser('https://www.instagram.com/feynman__app');
            }}
          />
          <DisplayCell
            title={t('Common:privacyPolicy')}
            onPress={() => {
              openWebBrowser(
                'https://www.feynmanapp.com/assets/docs/privacy-policy.pdf',
              );
            }}
            hasSegue
          />
          <DisplayCell
            title={t('Common:termsOfService')}
            onPress={() => {
              openWebBrowser(
                'https://www.feynmanapp.com/assets/docs/terms-and-conditions.pdf',
              );
            }}
            hasSegue
          />

          <DisplayCell
            title={t('Common:rateUs')}
            onPress={() => {
              StoreReview.requestReview();
            }}
            isLast
            hasSegue
          />

          <ScaleButton
            onPress={() => {
              Alert.alert(t('Common:logout'), t('Common:logoutMessage'), [
                {
                  text: t('Actions:cancel'),
                  style: 'cancel',
                },
                {
                  text: t('Common:logout'),
                  style: 'destructive',
                  onPress: () => {
                    setIsLoggingOut(true);
                    9;
                    dispatch(
                      ProfileAPI.logout((isDone: boolean) => {
                        if (isDone) {
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: RouteNames.SignIn}],
                            }),
                          );
                        }
                      }),
                    );
                  },
                },
              ]);
            }}
            activeScale={0.98}
            style={[
              styles.logout,
              {backgroundColor: theme.colors.secondaryBackground},
            ]}>
            <LogoutIcon />
            <MainText color={theme.colors.red}>{t('Common:logout')}</MainText>
          </ScaleButton>

          <View style={styles.version}>
            <MainText size={12}>{t('Common:version')}: 1.0.0</MainText>
          </View>
        </View>
      </ModalContainer>

      <Text style={{position: 'absolute'}}>
        {webBrowser &&
          webBrowser.type != 'cancel' &&
          JSON.stringify(webBrowser)}
      </Text>

      <NotificationSettingsModal
        isOpen={isNotificationVisible}
        setIsOpen={setNotificationVisible}
      />

      <LoaderOverlayView isVisible={isLoggingOut} />
    </>
  );
};

export default Settings;
