import MainText from '@/components/MainText';
import React from 'react';
import {View} from 'react-native';
import Modal from '../Modal';
import {ExampleModalProps} from '../Modal/types';

const ExampleModal = ({...props}: ExampleModalProps) => {
  const {example} = props;

  return (
    <Modal isCursorVisible {...props}>
      <View style={{padding: 16, paddingBottom: 32}}>
        <MainText size={24} weight="semiBold" style={{marginBottom: 16}}>
          Example
        </MainText>

        <MainText>{example.content}</MainText>
      </View>
    </Modal>
  );
};

export default ExampleModal;
