import useTheme from '@/hooks/useTheme';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {ScaleButton} from '../Buttons';
import MainText from '../MainText';
import styles from './styles';
import {SearchResultCellProps} from './types';

const SearchResultCell = ({
  result,
  onPress,
  searchText,
}: SearchResultCellProps) => {
  const theme = useTheme();

  const bookTitle = result?.book_title;
  const pickContent = result?.pick_content ?? result?.content;
  const pickTitle = result?.pick_title;
  const pickIndex = result?.pick_index;

  const contentRegex = new RegExp(`(${searchText})`, 'gi');
  const highlightedContent =
    pickContent && pickContent.replace(contentRegex, '{$1}');

  const titleRegex = new RegExp(`(${searchText})`, 'gi');
  const highlightedTitle =
    bookTitle != undefined && bookTitle.replace(titleRegex, '{$1}');

  const highlightedPickTitle =
    pickTitle != undefined && pickTitle?.replace(titleRegex, '{$1}');

  return (
    <ScaleButton
      onPress={() => onPress(result)}
      activeScale={0.98}
      style={[
        styles.cell,
        theme.styles.cell,
        {
          backgroundColor:
            theme.colorScheme == 'dark'
              ? theme.colors.background2
              : theme.colors.background,
        },
      ]}>
      {!!bookTitle && (
        <>
          <View style={{paddingBottom: 12}}>
            <MainText
              numberOfLines={2}
              size={18}
              letterSpacing={1.2}
              weight="semiBold">
              <ParsedText
                parse={[
                  {
                    pattern: /\{(.+?)\}/,
                    style: {
                      backgroundColor:
                        theme.colorScheme == 'light'
                          ? '#6212c980'
                          : theme.colors.accent,
                    },
                    renderText: (text: string) => text.replace(/{|}/g, ''),
                  },
                ]}>
                {highlightedTitle}
              </ParsedText>
            </MainText>
          </View>

          <View
            style={{
              width: '100%',
              marginBottom: 8,
              height: StyleSheet.hairlineWidth,
              backgroundColor: theme.colors.hairline,
            }}
          />
        </>
      )}

      {!!pickTitle && (
        <View style={styles.headerContent}>
          <MainText weight="bold" size={28}>
            {pickIndex + 1}.
          </MainText>

          <View style={{flex: 1, bottom: 4}}>
            <MainText numberOfLines={2} size={18} weight="bold">
              <ParsedText
                parse={[
                  {
                    pattern: /\{(.+?)\}/,
                    style: {
                      backgroundColor:
                        theme.colorScheme == 'light'
                          ? '#6212c980'
                          : theme.colors.accent,
                    },
                    renderText: (text: string) => text.replace(/{|}/g, ''),
                  },
                ]}>
                {highlightedPickTitle}
              </ParsedText>
            </MainText>
          </View>
        </View>
      )}

      <MainText size={17} style={{lineHeight: 25, letterSpacing: 1}}>
        <ParsedText
          parse={[
            {
              pattern: /\{(.+?)\}/,
              style: {
                backgroundColor:
                  theme.colorScheme == 'light'
                    ? '#6212c980'
                    : theme.colors.accent,
              },
              renderText: (text: string) => text.replace(/{|}/g, ''),
            },
          ]}>
          {highlightedContent}
        </ParsedText>
      </MainText>
    </ScaleButton>
  );
};

export default SearchResultCell;
