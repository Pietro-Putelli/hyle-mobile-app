import {MainButton} from '@/components/Buttons';
import DisplayCell from '@/components/DisplayCell';
import MainText from '@/components/MainText';
import useAppState from '@/hooks/useAppState';
import useSettings from '@/hooks/useSettings';
import useTheme from '@/hooks/useTheme';
import Permissions from '@/utils/permissions';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {MenuConfig} from 'react-native-ios-context-menu';
import {openSettings} from 'react-native-permissions';
import Modal from '../Modal';
import {NotificationSettingsModalProps} from '../Modal/types';

const NotificationSettingsModal = ({
  ...props
}: NotificationSettingsModalProps) => {
  const theme = useTheme();
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);

  const {notificationEnabled, notificationMode, changeNotification} =
    useSettings();

  const {t} = useTranslation();

  const notificationChoices = [
    {key: 'all', title: t('PushNotifications:allBooks')},
    {key: 'last-edit', title: t('PushNotifications:lastEdited')},
  ];

  const menuConfig: MenuConfig = {
    menuTitle: '',
    menuItems: [
      {actionTitle: t('PushNotifications:lastEdited'), actionKey: 'last-edit'},
      {actionTitle: t('PushNotifications:allBooks'), actionKey: 'all'},
    ],
  };

  const notificationModeTitle = notificationChoices.find(
    item => item.key === notificationMode,
  )?.title;

  useAppState(({isActive}) => {
    if (isActive) {
      Permissions.checkForNotificationPermission(status => {
        setNotificationEnabled(status === 'granted');
      });
    }
  }, []);

  return (
    <Modal
      isCursorVisible
      contentStyle={{paddingBottom: 24, paddingTop: 16, paddingHorizontal: 16}}
      {...props}>
      <View>
        <View style={{marginHorizontal: 4}}>
          <MainText
            size={26}
            weight="semiBold"
            style={{paddingLeft: 0, paddingBottom: 16}}>
            {t('Common:pushNotifications')}
          </MainText>

          <MainText size={14} style={{paddingRight: 16}}>
            {!isNotificationEnabled
              ? t('PushNotifications:disabledMessage')
              : t('PushNotifications:enabledMessage')}
          </MainText>
        </View>

        <View style={{marginTop: 24, gap: 12}}>
          <DisplayCell
            isFirst
            isLast
            backgroundColor={theme.colors.background}
            title={t('Common:chooseFrom')}
            value={notificationModeTitle}
            menuConfig={menuConfig}
            onPressMenuOption={key => {
              changeNotification({mode: key});
            }}
          />

          <DisplayCell
            disabled={!isNotificationEnabled}
            backgroundColor={theme.colors.background}
            isFirst
            isLast
            title={t('Common:enableNotifications')}
            value={notificationEnabled}
            onChange={() => {
              changeNotification({enabled: !notificationEnabled});
            }}
          />
        </View>

        {!isNotificationEnabled && (
          <View style={{marginTop: 32}}>
            <MainButton
              isHaptic
              activeScale={0.98}
              title={t('Common:enableNotifications')}
              onPress={() => {
                openSettings();
              }}
              type="primary"
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default NotificationSettingsModal;
