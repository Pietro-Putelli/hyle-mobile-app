import MainText from '@/components/MainText';
import React from 'react';
import {View} from 'react-native';
import Modal from '../Modal';
import {BookInfoProps} from '../Modal/types';
import useTheme from '@/hooks/useTheme';

const BookInfoModal = ({...props}: BookInfoProps) => {
  const {book} = props;

  const theme = useTheme();

  return (
    <Modal isCursorVisible {...props}>
      <View style={{padding: 16, paddingBottom: 32}}>
        <MainText size={24} weight="semiBold" style={{marginBottom: 24}}>
          {book.title}
        </MainText>

        <View style={{gap: 8}}>
          <MainText color={theme.colors.lightText} size={14}>
            Originally created by Pietro Putelli
          </MainText>

          <MainText color={theme.colors.lightText} size={14}>
            Created on {new Date(book.createdAt).toDateString()}
          </MainText>
        </View>
      </View>
    </Modal>
  );
};

export default BookInfoModal;
