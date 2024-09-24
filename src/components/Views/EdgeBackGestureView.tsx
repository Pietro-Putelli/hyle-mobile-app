import React, {memo} from 'react';
import {View} from 'react-native';

const EdgeBackGestureView = ({right}: any) => {
  return (
    <View
      style={{
        width: '4%',
        height: '100%',
        zIndex: 100,
        position: 'absolute',
        right: right ? 0 : null,
      }}
    />
  );
};

export default memo(EdgeBackGestureView);
