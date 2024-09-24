import TranslationContent from '@/components/TranslationContent';
import React from 'react';
import Modal from '../Modal';
import {TranslationModalProps} from '../Modal/types';

const TranslationModal = ({...props}: TranslationModalProps) => {
  const [data, setData] = React.useState<any>({});

  return (
    <Modal isCursorVisible contentStyle={{paddingBottom: 8}} {...props}>
      <TranslationContent
        data={data}
        setData={setData}
        annotation={props.annotation}
      />
    </Modal>
  );
};

export default TranslationModal;
