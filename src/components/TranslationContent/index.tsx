import AiAPI from '@/api/routes/ai';
import getAvailableLanguages from '@/constants/availableLanguages';
import useProfile from '@/hooks/useProfile';
import useSettings from '@/hooks/useSettings';
import useTheme from '@/hooks/useTheme';
import {unionBy} from 'lodash';
import {Skeleton} from 'moti/skeleton';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {LinkButton} from '../Buttons';
import LanguageSelector from '../LanguageSelector';
import MainText from '../MainText';
import styles from './styles';
import {TranslationContentProps} from './types';

const TranslationContent = ({
  data,
  setData,
  annotation,
  isEditing,
}: TranslationContentProps) => {
  const theme = useTheme();
  const {profile} = useProfile();
  const {t} = useTranslation();
  const {changeLanguage} = useSettings();

  /* Use to avoid invoking API if the content has been already fetched */
  const [tempHistory, setTempHistory] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(isEditing);

  const word = annotation.content;
  const defaultLanguage =
    annotation?.language ?? profile.settings.secondLanguage;
  const definition = data?.definition ?? annotation?.definition;
  const translation = data?.translation ?? annotation?.translation;
  const dictionaryUrl = data?.dictionaryUrl ?? annotation?.dictionaryUrl;

  const availableLanguages = getAvailableLanguages(t);

  const getTranslation = (language: string) => {
    const translationLanguage = availableLanguages.find(
      l => l.locale === language,
    );

    const languageName = translationLanguage?.name;

    if (languageName != undefined) {
      setIsLoading(true);

      AiAPI.getWordTranslation({word, lang: languageName}, data => {
        if (data) {
          const item = {
            translation: data.word,
            definition: data.explanation,
            language: translationLanguage?.code,
            dictionaryUrl: data.url,
          };

          setData(item);
          setTempHistory(unionBy(tempHistory, [item], 'language'));
          setIsLoading(false);
        }
      });
    }
  };

  const onChangeLanguage = (language: string) => {
    changeLanguage({secondLanguage: language});

    /* Check if language is already fetched */
    const item = tempHistory.find((item: any) => item.language === language);

    if (item) {
      setData(item);
    } else {
      getTranslation(language);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    if (word && !annotation?.translation) {
      getTranslation(defaultLanguage);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={{padding: 12, paddingHorizontal: 16, paddingBottom: 24}}>
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Skeleton show={isLoading}>
              <MainText
                numberOfLines={2}
                size={24}
                style={{
                  textTransform: 'capitalize',
                }}>
                {!isLoading ? translation : t('Common:loadingTranslation')}
              </MainText>
            </Skeleton>

            <LanguageSelector
              defaultLanguage={defaultLanguage}
              type={!isEditing ? 'primary' : 'secondary'}
              disabled={!isEditing || isLoading}
              onChange={onChangeLanguage}
            />
          </View>

          <View style={{marginTop: 8}}>
            <Skeleton show={isLoading}>
              <MainText
                color={theme.colors.lightText}
                numberOfLines={4}
                style={{
                  marginRight: 16,
                }}>
                {definition ?? t('Common:unableToTranslate')}
              </MainText>
            </Skeleton>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{marginTop: 8}}>
        <Skeleton show={isLoading}>
          <View>
            {dictionaryUrl != undefined && (
              <LinkButton
                title={t('Common:moreOnDictionary')}
                link={dictionaryUrl}
              />
            )}

            {isLoading && <View style={{width: 200, height: 20}} />}
          </View>
        </Skeleton>
      </View>
    </View>
  );
};

export default TranslationContent;
