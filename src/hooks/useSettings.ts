import {ProfileAPI} from '@/api/routes';
import i18n from '@/i18n';
import {
  getProfileSettings,
  updateProfileSettings,
} from '@/storage/slices/profileSlice';
import {isUndefined, omitBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';

const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(getProfileSettings);

  const colorScheme = settings.darkMode ? 'dark' : 'light';

  const setSettings = (newSettings: any) => {
    dispatch(updateProfileSettings(newSettings));

    ProfileAPI.updateData(
      {
        settings: {
          ...settings,
          ...newSettings,
        },
      },
      () => {},
    );
  };

  const changeColorScheme = (colorScheme: string) => {
    setSettings({darkMode: colorScheme === 'dark'});
  };

  const changeLanguage = ({appLanguage, secondLanguage}: any) => {
    if (appLanguage != undefined) {
      setSettings({appLanguage});
    }

    if (secondLanguage != undefined) {
      setSettings({secondLanguage});
    }
  };

  const changeNotification = ({enabled, mode}: any) => {
    const newSettings = omitBy(
      {notificationEnabled: enabled, notificationMode: mode},
      isUndefined,
    );

    setSettings(newSettings);
  };

  return {
    changeColorScheme,
    changeLanguage,
    changeNotification,
    setSettings,
    colorScheme,
    ...settings,
  };
};

export default useSettings;
