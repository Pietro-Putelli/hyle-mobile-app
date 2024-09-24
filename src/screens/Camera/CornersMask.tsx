import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const {width} = Dimensions.get('window');
const SIDE = width * 0.1;
const BORDR_WIDTH = 1;

const CornersMask = () => {
  return (
    <>
      <View
        style={[
          styles.corner,
          {
            borderTopWidth: BORDR_WIDTH,
            borderLeftWidth: BORDR_WIDTH,
          },
        ]}></View>
      <View
        style={[
          styles.corner,
          {
            right: 0,
            borderTopWidth: BORDR_WIDTH,
            borderRightWidth: BORDR_WIDTH,
          },
        ]}></View>

      <View
        style={[
          styles.corner,
          {
            bottom: 0,
            borderBottomWidth: BORDR_WIDTH,
            borderLeftWidth: BORDR_WIDTH,
          },
        ]}></View>
      <View
        style={[
          styles.corner,
          {
            bottom: 0,
            right: 0,
            borderRightWidth: BORDR_WIDTH,
            borderBottomWidth: BORDR_WIDTH,
          },
        ]}></View>
    </>
  );
};

export default CornersMask;

const styles = StyleSheet.create({
  corner: {
    width: SIDE,
    height: SIDE,
    zIndex: 2,
    position: 'absolute',
    borderColor: '#d9d9d960',
  },
  leftTopCorner: {},
  rightTopCorner: {
    right: 0,
  },
});
