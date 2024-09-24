import FilterIcon from '@/assets/icons/FilterIcon.svg';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import {View} from 'react-native';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import styles from './styles';

const FiltersButton = ({onSelectedFilter}: any) => {
  const theme = useTheme();

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={styles.separator} />

      <ContextMenuButton
        onPressMenuItem={({nativeEvent}: any) => {
          const actionKey = nativeEvent.actionKey;

          onSelectedFilter(actionKey);
        }}
        menuConfig={{
          menuTitle: '',
          menuItems: [
            {
              actionTitle: 'Order by latest',
              actionKey: 'order-asc',
            },

            {
              actionTitle: 'Order by oldest',
              actionKey: 'order-desc',
            },
          ],
        }}
        style={[
          styles.filterCell,
          {backgroundColor: theme.colors.secondaryBackground},
        ]}>
        <IconProvider Icon={FilterIcon} />
        <MainText weight="semiBold" uppercase size={14}>
          filters
        </MainText>
      </ContextMenuButton>
    </View>
  );
};

export default FiltersButton;
