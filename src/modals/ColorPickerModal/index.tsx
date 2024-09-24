import DoneIcon from '@/assets/icons/DoneIcon.svg';
import {ScaleButton} from '@/components/Buttons';
import IconProvider from '@/components/IconProvider';
import MainText from '@/components/MainText';
import {FlashList} from '@shopify/flash-list';
import {MotiView} from 'moti';
import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import Modal from '../Modal';
import {ColorModalProps} from '../Modal/types';
import styles from './styles';

const COLORS = require('@/data/colors.json');

const ColorPickerModal = ({
  initialColor = null,
  onChangeColor,
  setIsOpen,
  ...props
}: ColorModalProps) => {
  const [selected, setSelected] = useState<string | null>(initialColor);

  const renderItem = useCallback(
    ({item: color}: any) => {
      const isSelected = selected === color;

      return (
        <ScaleButton
          onPress={() => {
            setSelected(color);
            onChangeColor?.(color);

            setTimeout(() => {
              setIsOpen(false);
            }, 1000);
          }}
          isHaptic
          style={styles.cellOuter}>
          <View style={[{backgroundColor: color}, styles.cell]}>
            <MotiView
              animate={{
                scale: isSelected ? 1.2 : 0,
              }}>
              <IconProvider Icon={DoneIcon} />
            </MotiView>
          </View>
        </ScaleButton>
      );
    },
    [selected, onChangeColor],
  );

  return (
    <Modal setIsOpen={setIsOpen} isCursorVisible {...props}>
      <MainText size={28} weight="semiBold" style={styles.header}>
        Choose a color
      </MainText>

      <View style={{marginTop: 16, height: 500, marginBottom: 16}}>
        <FlashList
          extraData={selected}
          estimatedItemSize={100}
          numColumns={4}
          renderItem={renderItem}
          data={COLORS}
        />
      </View>
    </Modal>
  );
};

export default ColorPickerModal;
