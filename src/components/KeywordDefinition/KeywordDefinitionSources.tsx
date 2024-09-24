import useTheme from '@/hooks/useTheme';
import {extractShortUrl, getFavIconUrl} from '@/utils/urls';
import {Image} from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import {isEmpty} from 'lodash';
import {Skeleton} from 'moti/skeleton';
import React, {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {FadeAnimatedView} from '../Animations';
import {ScaleButton} from '../Buttons';
import SeparatorTitle from '../DisplayCell/SeparatorTitle';
import MainText from '../MainText';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const KeywordDefinitionSources = ({isLoading, isEditing, sources}: any) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [webBrowser, setWebBrowser] =
    useState<WebBrowser.WebBrowserResult | null>(null);

  const onSourcePress = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });

    setWebBrowser(result);
  };

  if (isEmpty(sources) && !isLoading) {
    return null;
  }

  return (
    <>
      <View style={styles.sources}>
        <SeparatorTitle
          titleStyle={{fontSize: 10}}
          title={t('Common:sources')}
          hasHairline
        />

        <Skeleton show={isLoading}>
          <View
            style={[styles.sourcesList, {height: isLoading ? 50 : undefined}]}>
            {sources.map((source: string, index: number) => {
              const url = extractShortUrl(source);

              return (
                <ScaleButton
                  activeScale={0.96}
                  key={index}
                  onPress={() => onSourcePress(source)}
                  style={[
                    styles.sourceItem,
                    {borderColor: theme.colors.border},
                  ]}>
                  <Image
                    style={styles.favIcon}
                    source={{uri: getFavIconUrl(source)}}
                  />
                  <MainText
                    style={{
                      bottom: -1,
                      maxWidth: width * (isEditing ? 0.8 : 0.65),
                    }}
                    size={12}
                    numberOfLines={1}>
                    {url}
                  </MainText>
                </ScaleButton>
              );
            })}
          </View>
        </Skeleton>
      </View>

      <Text>
        {webBrowser &&
          webBrowser.type != 'cancel' &&
          JSON.stringify(webBrowser)}
      </Text>
    </>
  );
};

export default KeywordDefinitionSources;
