import {Notifications} from 'react-native-notifications';
import {
  request,
  PERMISSIONS,
  check,
  requestNotifications,
  checkNotifications,
  openSettings,
} from 'react-native-permissions';

type GrantedPermissionsCallback = (isGranted: boolean) => void;

class Permissions {
  static askForMicrophonePermission = async (
    callback: GrantedPermissionsCallback,
  ) => {
    check(PERMISSIONS.IOS.MICROPHONE).then(result => {
      const isGranted = result === 'granted';

      if (isGranted) {
        return;
      }

      request(PERMISSIONS.IOS.MICROPHONE).then(result => {
        const isGranted = result === 'granted';
        callback(isGranted);
      });
    });
  };

  static askForCameraPermission = async (
    callback: GrantedPermissionsCallback,
  ) => {
    check(PERMISSIONS.IOS.CAMERA).then(result => {
      const isGranted = result === 'granted';

      if (isGranted) {
        return;
      }

      request(PERMISSIONS.IOS.CAMERA).then(result => {
        const isGranted = result === 'granted';
        callback(isGranted);
      });
    });
  };

  static askForNotificationPermission = (
    callback: (granted: boolean) => void,
  ) => {
    requestNotifications(['alert', 'sound']).then(({status}) =>
      callback(status == 'granted'),
    );
  };

  static checkForNotificationPermission = (
    callback: (status: string) => void,
  ) => {
    checkNotifications().then(({status}) => callback(status));
  };

  static askForNotification = () => {
    this.askForNotificationPermission(granted => {
      if (granted) {
        Notifications.registerRemoteNotifications();
      }
    });
  };
}

export default Permissions;
