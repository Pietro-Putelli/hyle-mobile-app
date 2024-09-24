import {useFocusEffect as _useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

type CallbackType = (isFocused: boolean) => void;

const useFocusEffect = (callback: CallbackType, dependencies: any[] = []) => {
  _useFocusEffect(
    useCallback(() => {
      callback(true);

      return () => {
        callback(false);
      };
    }, [...dependencies]),
  );
};

export default useFocusEffect;
