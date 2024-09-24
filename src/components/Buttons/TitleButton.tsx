import {MotiView} from 'moti';
import React from 'react';
import {StyleSheet} from 'react-native';
import Loader from '../Loader';
import MainText from '../MainText';
import ScaleButton from './ScaleButton';
import {TitleButtonProps} from './types';

const TitleButton = ({children, isLoading, ...props}: TitleButtonProps) => {
  return (
    <ScaleButton style={styles.container} {...props}>
      <MotiView
        animate={{
          opacity: isLoading ? 0 : 1,
        }}>
        <MainText weight="semiBold">{children}</MainText>
      </MotiView>

      <MotiView
        animate={{
          opacity: isLoading ? 1 : 0,
          scale: isLoading ? 1 : 0,
        }}
        style={styles.loader}>
        <Loader isActive size={24} />
      </MotiView>
    </ScaleButton>
  );
};

export default TitleButton;

const styles = StyleSheet.create({
  container: {},
  loader: {
    alignSelf: 'center',
    position: 'absolute',
  },
});
