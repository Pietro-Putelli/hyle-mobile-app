import PenIcon from '@/assets/icons/PenIcon.svg';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {IconButton} from '../Buttons';
import MainText from '../MainText';
import KeywordView from '../Views/KeywordView';
import KeywordDefinitionSources from './KeywordDefinitionSources';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const KeywordDefinition = ({annotation}: any) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const annotationSources = annotation?.sources ?? [];
  const annotationContent = annotation.annotation;

  const onEditPress = () => {
    navigation.navigate(RouteNames.EditAnnotation, {annotation});
  };

  return (
    <View style={[theme.styles.cell, styles.container]}>
      <View style={styles.header}>
        <KeywordView annotation={annotation} />

        <IconButton
          type="tertiary"
          side={40}
          iconScale={0.9}
          icon={PenIcon}
          onPress={onEditPress}
        />
      </View>

      <View style={styles.content}>
        <MainText
          color={
            annotationContent == '' ? theme.colors.lightText : theme.colors.text
          }>
          {annotationContent == ''
            ? t('Common:addContentToAnnotation')
            : annotationContent}
        </MainText>
      </View>

      <KeywordDefinitionSources isEditing={false} sources={annotationSources} />
    </View>
  );
};

export default KeywordDefinition;
