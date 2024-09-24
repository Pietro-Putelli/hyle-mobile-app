import useTheme from '@/hooks/useTheme';
import * as WebBrowser from 'expo-web-browser';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import MainText from '../MainText';
import {LinkButtonProps} from './types';

const LinkButton = ({title, link}: LinkButtonProps) => {
  const theme = useTheme();
  const [result, setResult] = useState<WebBrowser.WebBrowserResult | null>(
    null,
  );

  const onPress = async () => {
    let result = await WebBrowser.openBrowserAsync(link, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });

    setResult(result);
  };

  useEffect(() => {
    return () => {
      setResult(null);
    };
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <MainText
        size={15}
        style={{
          color: theme.colors.link,
          textDecorationLine: 'underline',
        }}>
        {title}
      </MainText>

      <Text style={{position: 'absolute'}}>
        {result && result.type != 'cancel' && JSON.stringify(result)}
      </Text>
    </TouchableOpacity>
  );
};

export default LinkButton;
