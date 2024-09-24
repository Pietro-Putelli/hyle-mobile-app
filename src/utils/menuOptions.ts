import {store} from '@/storage/store';
import {MenuConfig} from 'react-native-ios-context-menu';

export const NativeIcons: Record<string, Record<string, string>> = {
  light: {
    Camera: 'D_CameraIcon',
    Copy: 'D_CopyIcon',
    RatoPrev: 'D_RatoPrevIcon',
    RatoNext: 'D_RatoNextIcon',
    Share: 'D_ShareIcon',
    Gallery: 'D_GalleryIcon',
    Mic: 'D_MicIcon',
    Tag: 'D_TagIcon',
    TextInput: 'D_TextInputIcon',
    Pen: 'D_PenIcon',
    HeadPhone: 'D_HeadPhoneIcon',
    MovePick: 'D_MovePickIcon',
    Info: 'D_InfoIcon',
    AddBefore: 'D_AddBeforeIcon',
    AddAfter: 'D_AddAfterIcon',
  },
  dark: {
    Camera: 'L_CameraIcon',
    Copy: 'L_CopyIcon',
    RatoNext: 'L_RatoNextIcon',
    RatoPrev: 'L_RatoPrevIcon',
    Share: 'L_ShareIcon',
    Gallery: 'L_GalleryIcon',
    Mic: 'L_MicIcon',
    Tag: 'L_TagIcon',
    TextInput: 'L_TextInputIcon',
    Pen: 'L_PenIcon',
    HeadPhone: 'L_HeadPhoneIcon',
    MovePick: 'L_MovePickIcon',
    Info: 'L_InfoIcon',
    AddBefore: 'L_AddBeforeIcon',
    AddAfter: 'L_AddAfterIcon',
  },
  common: {
    Delete: 'DeleteIcon',
    StopAudio: 'StopAudioIcon',
  },
};

type OptionProps = {
  key: string;
  title: string;
  icon: string;
  isDestructive?: boolean;
};

type GenerateOptionsParams = {
  options: OptionProps[];
  menuTitle?: string;
};

export const generateMenuOptions = ({
  options,
  menuTitle,
}: GenerateOptionsParams): MenuConfig => {
  const {settings} = store.getState().profileSlice;
  const colorScheme = settings.darkMode ? 'dark' : 'light';

  return {
    menuTitle: menuTitle ?? '',
    menuItems: options.map((option: OptionProps) => {
      return {
        actionKey: option.key,
        actionTitle: option.title,
        menuAttributes: option.isDestructive ? ['destructive'] : [],
        icon: {
          iconType: 'ASSET',
          iconValue: option.isDestructive
            ? NativeIcons.common.Delete
            : NativeIcons[colorScheme][option.icon] ??
              NativeIcons.common[option.icon],
        },
      };
    }),
  };
};
