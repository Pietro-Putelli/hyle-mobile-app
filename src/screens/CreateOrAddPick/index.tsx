import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import {MainButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import MainText from '@/components/MainText';
import TextInput from '@/components/TextInput';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {
  flushStateEditPickState,
  getEditPickState,
} from '@/storage/slices/editPickSlice';
import {useNavigation} from '@react-navigation/native';
import {default as React} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const CreateOrAddPick = () => {
  const theme = useTheme();
  const dispatch = useDispatch<MiddlewareDispatch>();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [bookData, setBookData] = React.useState({
    title: '',
    author: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const isCreateButtonEnabled = bookData.title.replace(/\s/g, '').length >= 2;

  const {parts} = useSelector(getEditPickState);

  const onCreatePress = () => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    dispatch(
      BookAPI.create(
        {title: bookData.title, author: bookData.author, pickIndex: 0, parts},
        isSucceded => {
          if (isSucceded) {
            dispatch(flushStateEditPickState());

            navigation.navigate(RouteNames.Root);
          } else {
            setIsLoading(false);
          }
        },
      ),
    );
  };

  return (
    <ModalContainer
      scrollProps={{keyboardDismissMode: 'none'}}
      accessoryView={
        <View
          style={{
            gap: 12,
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingBottom: 12,
            flexDirection: 'row',
            borderTopColor: theme.colors.hairline,
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingTop: 12,
          }}>
          <View style={{flex: 1}}>
            <MainButton
              isHaptic
              type="primary"
              title={t('Actions:createBook')}
              loadingText={t('Common:creating')}
              fullLoadingDuration={6000}
              onPress={onCreatePress}
              activeScale={0.96}
              isLoading={isLoading}
              disabled={!isCreateButtonEnabled}
            />
          </View>

          <View style={{flex: 1}}>
            <MainButton
              type="secondary"
              title={t('Actions:addToBook')}
              activeScale={0.96}
              onPress={() => {
                navigation.navigate(RouteNames.BooksSelector, {
                  pick: {parts},
                });
              }}
            />
          </View>
        </View>
      }
      title={t('Actions:createOrAddPick')}
      style={{paddingHorizontal: 12}}>
      <View style={{flex: 1}}>
        <View style={styles.inputContainer}>
          <TextInput
            size={18}
            autoFocus
            clearButtonMode="while-editing"
            placeholder={t('Common:bookTitle')}
            maxLength={64}
            outerStyle={[
              {backgroundColor: theme.colors.secondaryBackground},
              styles.inputOuter,
            ]}
            value={bookData.title}
            onChangeText={text => {
              setBookData({...bookData, title: text});
            }}
          />

          <TextInput
            size={18}
            clearButtonMode="while-editing"
            placeholder={t('Common:bookAuthorOptional')}
            maxLength={64}
            outerStyle={[
              {backgroundColor: theme.colors.secondaryBackground},
              styles.inputOuter,
            ]}
            value={bookData.author}
            onChangeText={text => {
              setBookData({...bookData, author: text});
            }}
          />

          <View style={{paddingHorizontal: 6}}>
            <MainText color={theme.colors.lightText} size={13}>
              {t('Common:emptyAuthorHint')}
            </MainText>
          </View>
        </View>
      </View>
    </ModalContainer>
  );
};

export default CreateOrAddPick;
