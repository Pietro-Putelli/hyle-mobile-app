import Gradients from '@/constants/gradients';
import {useEffect, useState} from 'react';
import {
  Appearance,
  ColorSchemeName,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import useSettings from './useSettings';

const THEME: Record<string, any> = {
  dark: {
    accent: '#441C78',
    lightAccent: '#6212c9',
    background: '#060606',
    background2: '#090909',
    background3: '#101010',
    secondaryBackground: '#121212',
    tertiaryBackground: '#1E1E1E',
    translucentBackground: 'rgba(6,6,6,0.98)',
    text: '#fff',
    lightText: '#d9d9d990',
    border: '#ffffff20',
    link: '#17C37B',
    red: '#c91e35',
    hairline: '#ffffff20',

    keyword: '#1d3461',
    annotation: '#386641',
    translation: '#bd1e28',
    gradient: Gradients.BlackToTransparent,
  },
  light: {
    accent: '#441C78',
    lightAccent: '#6212c9',
    background: '#EAEAEA',
    background2: '#EAEAEA',
    background3: '#F9F9F9',
    secondaryBackground: '#F9F9F9',
    tertiaryBackground: '#FFFFFF',
    translucentBackground: 'rgba(234,234,234,0.98)',
    text: '#121212',
    lightText: '#12121290',
    border: '#00000020',
    link: '#17C37B',
    red: '#c91e35',
    hairline: '#00000020',

    keyword: '#1d3461',
    annotation: '#386641',
    translation: '#bd1e28',
    gradient: Gradients.WhiteToTransparent,
  },
};

const getTheme = (colorScheme: string) => {
  return {
    colors: THEME[colorScheme],
    styles: {
      container: {
        flex: 1,
        backgroundColor: THEME[colorScheme].background,
      },
      cell: {
        borderRadius: 20,
        backgroundColor: THEME[colorScheme].secondaryBackground,
      },
      negativeCell: {
        borderRadius: 20,
        backgroundColor: THEME[colorScheme].background,
      },
      containerShadow: {
        backgroundColor: THEME[colorScheme].secondaryBackground,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      },
      hairlineBottom: {
        borderBottomColor: THEME[colorScheme].hairline,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      hairlineTop: {
        borderTopColor: THEME[colorScheme].hairline,
        borderTopWidth: StyleSheet.hairlineWidth,
      },
    },
  };
};

const useTheme = () => {
  const {colorScheme} = useSettings();

  const systemColorScheme = useColorScheme();

  const statusBarStyle =
    colorScheme == 'dark' ? 'light-content' : 'dark-content';

  const [theme, setTheme] = useState(getTheme(colorScheme));

  useEffect(() => {
    if (systemColorScheme != colorScheme) {
      Appearance.setColorScheme(colorScheme as ColorSchemeName);
    }

    setTheme(getTheme(colorScheme));
  }, [colorScheme]);

  return {
    colorScheme,
    statusBarStyle: statusBarStyle as any,
    ...theme,
  };
};

export default useTheme;
