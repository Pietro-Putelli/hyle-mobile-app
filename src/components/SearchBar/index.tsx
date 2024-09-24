import SearchIcon from '@/assets/icons/SearchIcon.svg';
import useSearchFashion from '@/hooks/useSearchFashion';
import useTheme from '@/hooks/useTheme';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import IconProvider from '../IconProvider';
import styles from './styles';

const SearchBar = forwardRef(
  ({onSearch, onChange, hideIcon, style, ...props}: any, ref) => {
    const theme = useTheme();
    const {t} = useTranslation();

    const {searchText, onChangeText} = useSearchFashion({
      onChange: ({value}: any) => {
        const isEmpty = value.replace(/\s/g, '').length === 0;

        onSearch({text: value, isEmpty});
      },
    });

    const _onChangeText = (text: string) => {
      onChange?.(text);
      onChangeText(text);
    };

    return (
      <View
        style={[
          theme.styles.cell,
          {
            backgroundColor: theme.colors.background2,
          },
          styles.container,
          style,
        ]}>
        {!hideIcon && (
          <View style={{opacity: 0.8}}>
            <IconProvider Icon={SearchIcon} />
          </View>
        )}

        <TextInput
          ref={ref}
          placeholder={t('Common:searchPlaceholder')}
          style={{
            flex: 1,
            fontSize: 19,
            fontFamily: 'Ralway-Regular',
            color: theme.colors.text,
            letterSpacing: 0.7,
            top: 1,
          }}
          clearButtonMode="while-editing"
          selectionColor={theme.colors.lightAccent}
          placeholderTextColor={theme.colors.lightText}
          {...props}
          onChangeText={_onChangeText}
          value={searchText}
        />
      </View>
    );
  },
);

export default SearchBar;
