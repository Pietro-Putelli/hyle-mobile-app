import {InputModes} from '@/types/InputMode';
import {MenuConfig, MenuElementConfig} from 'react-native-ios-context-menu';

import CameraIcon from '@/assets/icons/CameraIcon.svg';
import MicIcon from '@/assets/icons/MicIcon.svg';
import TextInputIcon from '@/assets/icons/TextInputIcon.svg';
import {NativeIcons} from '@/utils/menuOptions';
import {store} from '@/storage/store';

const getTextOptions = (theme: string): MenuElementConfig => ({
  actionTitle: 'Write',
  actionKey: InputModes.Text,
  icon: {
    iconType: 'ASSET',
    iconValue: NativeIcons[theme].TextInput,
  },
});

const getMicOption = (theme: string): MenuElementConfig => ({
  actionTitle: 'Record',
  actionKey: InputModes.Mic,
  icon: {
    iconType: 'ASSET',
    iconValue: NativeIcons[theme].Mic,
  },
});

const getCameraOption = (theme: string): MenuElementConfig => ({
  actionTitle: 'Scan',
  actionKey: InputModes.Scan,
  icon: {
    iconType: 'ASSET',
    iconValue: NativeIcons[theme].Camera,
  },
});

const getGalleryOptions = (theme: string): MenuElementConfig => ({
  actionTitle: 'Gallery',
  actionKey: InputModes.Gallery,
  icon: {
    iconType: 'ASSET',
    iconValue: NativeIcons[theme].Gallery,
  },
});

export const InputMethodIcons = {
  Text: TextInputIcon,
  Mic: MicIcon,
  Scan: CameraIcon,
};

type GetInputMethodsMenuParams = {
  current?: string;
  type?: 'pick' | 'pickDetail';
};

export const getInputMethodsMenuConfig = ({
  current,
  type,
}: GetInputMethodsMenuParams): MenuConfig => {
  const {settings} = store.getState().profileSlice;
  const colorScheme = settings.darkMode ? 'dark' : 'light';

  let menuItems = [
    getMicOption(colorScheme),
    getCameraOption(colorScheme),
    getGalleryOptions(colorScheme),
  ];

  if (current == InputModes.Mic) {
    menuItems = [
      getTextOptions(colorScheme),
      getCameraOption(colorScheme),
      getGalleryOptions(colorScheme),
    ];
  }

  if (type == 'pickDetail') {
    menuItems = [
      getTextOptions(colorScheme),
      getMicOption(colorScheme),
      getCameraOption(colorScheme),
    ];
  }

  return {menuTitle: '', menuItems};
};
