import React, {forwardRef, useMemo} from 'react';
import {TextInput as _TextInput} from 'react-native-gesture-handler';
import styles from './styles';
import {TextInputProps} from './types';
import useTheme from '@/hooks/useTheme';
import {View} from 'react-native';

const TextInput = forwardRef(
  (
    {
      size = 20,
      onSelectionChange,
      style,
      outerStyle,
      isSolid,
      ...props
    }: TextInputProps,
    ref,
  ) => {
    const theme = useTheme();

    const _onSelectionChange = ({nativeEvent}: any) => {
      onSelectionChange?.(nativeEvent);
    };

    const customStyle = useMemo(() => {
      if (isSolid) {
        return {
          ...theme.styles.cell,
          padding: 16,
          paddingHorizontal: 23,
        };
      }

      if (outerStyle) {
        return outerStyle;
      }

      return {flex: 1};
    }, [isSolid, outerStyle]);

    return (
      <View style={customStyle}>
        <_TextInput
          ref={ref}
          style={[
            styles.input,
            style,
            {color: theme.colors.text, fontSize: size},
          ]}
          selectionColor={'#441C78'}
          scrollEnabled={false}
          {...props}
          placeholderTextColor={theme.colors.lightText}
          onSelectionChange={_onSelectionChange}>
          {props.children}
        </_TextInput>
      </View>
    );
  },
);

export default TextInput;

export const TextInputType = typeof _TextInput;
