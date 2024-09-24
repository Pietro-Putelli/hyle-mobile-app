import CloseIcon from '@/assets/icons/CloseIcon.svg';
import MoreIcon from '@/assets/icons/MoreIcon.svg';
import RedoIcon from '@/assets/icons/RedoIcon.svg';
import UndoIcon from '@/assets/icons/UndoIcon.svg';

import {generateMenuOptions} from '@/utils/menuOptions';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';
import {ContextMenuButton, MenuConfig} from 'react-native-ios-context-menu';
import {IconButton} from '../Buttons';
import styles from './styles';
import {AddPickNavigationHeaderProps} from './types';

const AddPickNavigationHeader = ({
  isEditing,
  isPrevDisabled,
  isNextDisabled,
  onStateChange,
  onClosePress,
  onDeletePress,
}: AddPickNavigationHeaderProps) => {
  const {t} = useTranslation();

  const onPrevState = () => onStateChange('prev');

  const onNextState = () => onStateChange('next');

  const onPressMenuItem = ({nativeEvent}: any) => {
    const {actionKey} = nativeEvent;

    if (actionKey == 'delete') {
      Alert.alert(t('Popups:deletePickTitle'), t('Popups:deletePickMessage'), [
        {
          text: t('Actions:cancel'),
          style: 'cancel',
        },
        {
          text: t('Actions:delete'),
          style: 'destructive',
          onPress: onDeletePress,
        },
      ]);
    }
  };

  const menuConfig: MenuConfig = useMemo(() => {
    return generateMenuOptions({
      options: [
        {
          title: t('Actions:delete'),
          icon: 'Delete',
          key: 'delete',
          isDestructive: true,
        },
      ],
    });
  }, [isEditing]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row', gap: 24}}>
        <IconButton
          isHaptic
          type="secondary"
          onPress={onClosePress}
          icon={CloseIcon}
        />

        <View style={{flexDirection: 'row', gap: 12}}>
          <IconButton
            disabled={isPrevDisabled}
            type="secondary"
            icon={UndoIcon}
            onPress={onPrevState}
            isHaptic
          />
          <IconButton
            disabled={isNextDisabled}
            type="secondary"
            icon={RedoIcon}
            onPress={onNextState}
            isHaptic
          />
        </View>
      </View>

      {isEditing && (
        <ContextMenuButton
          onPressMenuItem={onPressMenuItem}
          isMenuPrimaryAction
          menuConfig={menuConfig}>
          <IconButton
            type="tertiary"
            icon={MoreIcon}
            style={{marginRight: -8}}
          />
        </ContextMenuButton>
      )}
    </View>
  );
};

export default AddPickNavigationHeader;
