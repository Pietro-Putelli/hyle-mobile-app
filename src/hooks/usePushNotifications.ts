import Permissions from '@/utils/permissions';
import {useEffect} from 'react';
import {Notification, Notifications} from 'react-native-notifications';
import {useDispatch} from 'react-redux';
import useProfile from './useProfile';
import {ProfileAPI} from '@/api/routes';
import {setDeviceToken} from '@/storage/slices/profileSlice';
import useAppState from './useAppState';
import {
  CommonActions,
  NavigationProp,
  NavigationState,
  useNavigation,
} from '@react-navigation/native';
import RouteNames from '@/constants/routeNames';

const usePushNotifications = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const {profile, isLogged} = useProfile();

  const deviceToken = profile.deviceToken;
  const isDeviceTokenRegistered = profile.isDeviceTokenRegistered;
  const hasDeviceToken = !!deviceToken;

  /* Methods */

  const handleReceivedNotification = async (
    notification: Notification | undefined,
    completion?: () => void,
  ) => {
    const payload = notification?.payload;
    const payloadData = payload?.data;

    if (!payloadData) {
      return;
    }

    /* Do the route logic here starting from payload */

    /* Dismiss all open modals */

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: RouteNames.Home}],
      }),
    );

    const bookId = payloadData?.book_id;

    if (bookId != undefined) {
      navigation.navigate(RouteNames.BookDetail, {bookId});
    }

    completion?.();
  };

  const saveDeviceToken = (deviceToken: string) => {
    ProfileAPI.updateSession(deviceToken, () => {
      dispatch(setDeviceToken(deviceToken));
    });
  };

  /* Effects */

  useEffect(() => {
    if (!isLogged) {
      return;
    }

    let timeout: any = null;

    Permissions.checkForNotificationPermission(status => {
      if (status == 'granted' && !hasDeviceToken) {
        Notifications.registerRemoteNotifications();
      } else {
        /* If the token has been already registered, it means that the permission is granted */
        if (hasDeviceToken && !isDeviceTokenRegistered) {
          saveDeviceToken(deviceToken);
        } else {
          timeout = setTimeout(() => {
            Permissions.askForNotification();
          }, 15_000);
        }
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [isLogged]);

  useEffect(() => {
    if (!isDeviceTokenRegistered) {
      Notifications.events().registerRemoteNotificationsRegistered(
        ({deviceToken}) => {
          console.log('==>', deviceToken);
          /* Update user's current session */
          saveDeviceToken(deviceToken);
        },
      );
    }
  }, [isDeviceTokenRegistered]);

  useEffect(() => {
    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      event => {
        console.error(event);
      },
    );
  }, []);

  useAppState(({isActive}) => {
    if (isActive) {
      Notifications.ios.setBadgeCount(0);
    }
  });

  useEffect(() => {
    Notifications.events().registerNotificationOpened(
      handleReceivedNotification,
    );

    /* Handle notifications when the app is closed */

    Notifications.getInitialNotification()
      .then(handleReceivedNotification)
      .catch(err => {
        console.error('[get-initial-notification]', err);
      });
  }, []);
};

export default usePushNotifications;
