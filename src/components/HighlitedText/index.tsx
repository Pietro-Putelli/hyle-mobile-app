import useTheme from '@/hooks/useTheme';
import {KeywordTypeValue} from '@/types/AddPick';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import MainText from '../MainText';
import {HighlitedTextProps} from './types';

const HighlitedText = ({children, onPartPress}: HighlitedTextProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
      {children.map((part, index) => {
        const {content, type} = part;

        const touchDisabled =
          part.annotation == undefined || part.annotation == '';

        if (type == 'text') {
          const words = content.split(' ');

          return words.map((word, index) => {
            return (
              <MainText size={17} style={{paddingVertical: 1}} key={index}>
                {word}
                {words.length - 1 === index ? '' : ' '}
              </MainText>
            );
          });
        }

        if (
          type == KeywordTypeValue.ANNOTATION ||
          type == KeywordTypeValue.TRANSLATION
        ) {
          const isTranslation = type == KeywordTypeValue.TRANSLATION;

          return (
            <TouchableOpacity
              onPress={() => {
                onPartPress(part);
              }}
              activeOpacity={0.8}
              style={{
                paddingVertical: 1,
              }}
              key={index}>
              <MainText
                size={17}
                style={{
                  textDecorationLine: 'underline',
                  textDecorationStyle: isTranslation ? 'dotted' : 'solid',
                }}>
                {content}
              </MainText>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            disabled={touchDisabled}
            onPress={() => {
              onPartPress(part);
            }}
            activeOpacity={0.8}
            style={{
              backgroundColor: theme.colors.keyword,
              marginVertical: 2,
              borderRadius: 6,
              paddingHorizontal: 4,
              paddingVertical: 2,
            }}
            key={index}>
            <MainText color={'#fff'} size={16.5}>
              {content}
            </MainText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HighlitedText;
