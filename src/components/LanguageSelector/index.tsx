import getAvailableLanguages from '@/constants/availableLanguages';
import useProfile from '@/hooks/useProfile';
import useTheme from '@/hooks/useTheme';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ContextMenuButton, MenuConfig} from 'react-native-ios-context-menu';
import MainText from '../MainText';
import styles from './styles';
import {LanguageSelectorProp} from './types';

const LanguageSelector = ({
  menuTitle,
  style,
  type,
  disabled,
  defaultLanguage,
  onChange,
  onPress,
}: LanguageSelectorProp) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {profile} = useProfile();

  const availableLanguages = getAvailableLanguages(t);

  const secondLanguage =
    availableLanguages.find(
      language =>
        language.locale === defaultLanguage ?? profile.settings.secondLanguage,
    ) ?? availableLanguages[0];

  const menuConfig: MenuConfig = useMemo(() => {
    return {
      menuTitle: menuTitle ?? t('Common:changeTranslationLanguage'),
      menuItems: availableLanguages.map(language => {
        return {
          actionKey: language.locale,
          actionTitle: `${language.flag}  ${language.name}`,
        };
      }),
    };
  }, [menuTitle]);

  const _style = useMemo(() => {
    let backgroundColor;

    if (type === 'primary') {
      backgroundColor = theme.colors.background;
    } else {
      backgroundColor = theme.colors.secondaryBackground;
    }

    return {backgroundColor};
  }, [type]);

  const [selectedLanguage, setSelectedLanguage] = useState(secondLanguage);

  const onPressMenuItem = ({nativeEvent}: any) => {
    const actionKey = nativeEvent.actionKey;

    const language = availableLanguages.find(
      language => language.locale === actionKey,
    );

    if (language) {
      setSelectedLanguage(language);
      onChange?.(language.locale);
    }
  };

  return (
    <ContextMenuButton
      onTouchStart={onPress}
      onPressMenuItem={onPressMenuItem}
      menuConfig={menuConfig}
      isMenuPrimaryAction
      pointerEvents={disabled ? 'none' : 'auto'}>
      <View style={[styles.container, _style, style]}>
        <MainText style={{bottom: 1.5}} size={16}>
          {selectedLanguage.flag}
        </MainText>
        <MainText weight="semiBold" uppercase size={15}>
          {selectedLanguage.locale}
        </MainText>
      </View>
    </ContextMenuButton>
  );
};

export default LanguageSelector;
