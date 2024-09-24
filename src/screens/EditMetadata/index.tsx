import BookAPI from '@/api/routes/book';
import {ModalContainer} from '@/components/Containers';
import TextInput from '@/components/TextInput';
import useBooks from '@/hooks/useBooks';
import {
  getStateBookPickById,
  updateStateBookPick,
} from '@/storage/slices/booksSlice';
import {trimBoundarySpaces} from '@/utils/strings';
import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const EditMetadata = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {params} = useRoute<any>();
  const {t} = useTranslation();

  const bookId = params?.bookId;
  const pickId = params?.pickId;

  const isEditingPick = pickId !== undefined;

  const {book, updateBookMetadata} = useBooks({bookId});

  const [isLoading, setIsLoading] = useState(false);

  const pick = useSelector((state: any) => {
    if (isEditingPick) {
      return getStateBookPickById(state, bookId, pickId);
    }

    return null;
  });

  const initalMetadata = isEditingPick
    ? _.pick(pick, ['title'])
    : _.pick(book, ['title', 'author']);

  const [metadata, setMetadata] = useState<any>(initalMetadata);

  const isTitleValid = metadata.title.trim().length > 0;

  const hasMetadataChanged =
    JSON.stringify(initalMetadata) !== JSON.stringify(metadata);

  const isDoneButtonEnabled = useMemo(() => {
    if (isEditingPick) {
      return hasMetadataChanged;
    }

    return isTitleValid && hasMetadataChanged;
  }, [hasMetadataChanged, isTitleValid, isEditingPick]);

  const callback = () => navigation.goBack();

  const onDonePress = () => {
    if (!isDoneButtonEnabled) {
      navigation.goBack();
      return;
    }

    setIsLoading(true);

    const title = trimBoundarySpaces(metadata.title);
    const author = trimBoundarySpaces(metadata.author);

    if (isEditingPick) {
      BookAPI.updatePick({bookId, pickId, title}, isSucceded => {
        if (isSucceded) {
          dispatch(updateStateBookPick({bookId, pickId, title}));
          callback();
        }
      });
    } else {
      updateBookMetadata({title, author}, callback);
    }
  };

  return (
    <ModalContainer
      onDonePress={onDonePress}
      isDoneButtonLoading={isLoading}
      isDoneButtonEnabled={isDoneButtonEnabled}
      title={t('Actions:editMetadata')}
      description={t('Common:editBookMetadataHeader')}
      scrollDisabled>
      <View style={{marginTop: 16, gap: 16}}>
        <TextInput
          autoFocus
          size={18}
          clearButtonMode="while-editing"
          isSolid
          placeholder={
            !isEditingPick ? t('Common:bookTitle') : t('Common:pickTitle')
          }
          value={metadata.title}
          maxLength={64}
          onChangeText={title => setMetadata({...metadata, title})}
        />

        {!isEditingPick && (
          <TextInput
            size={18}
            clearButtonMode="while-editing"
            isSolid
            placeholder={t('Common:bookAuthor')}
            value={metadata.author}
            onChangeText={author => setMetadata({...metadata, author})}
            maxLength={64}
          />
        )}
      </View>
    </ModalContainer>
  );
};

export default EditMetadata;
