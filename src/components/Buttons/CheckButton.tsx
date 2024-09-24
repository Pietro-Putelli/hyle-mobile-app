import NegativeDoneIcon from '@/assets/icons/NegativeDoneIcon.svg';
import useTheme from '@/hooks/useTheme';
import {MotiView} from 'moti';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const CheckButton = ({isSelected}: any) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {borderColor: theme.colors.accent}]}>
      <MotiView
        from={{scale: 0}}
        animate={{
          scale: isSelected ? 1 : 0,
        }}
        transition={{type: 'timing'}}>
        <NegativeDoneIcon />
      </MotiView>
    </View>
  );
};

export default CheckButton;

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    borderRadius: 22 * 0.45,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
