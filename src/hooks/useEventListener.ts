import {useIsFocused} from '@react-navigation/native';
import {isUndefined} from 'lodash';
import {useEffect} from 'react';
import {EventRegister} from 'react-native-event-listeners';

const useEventListener = (
  {identifier, disabled}: any,
  callback: () => void,
  dependencies: any[] = [],
) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isUndefined(identifier)) {
      return;
    }

    EventRegister.addEventListener(identifier, () => {
      if (!disabled && isFocused) {
        callback();
      }
    });

    return () => {
      EventRegister.removeEventListener(identifier);
    };
  }, [disabled, ...dependencies]);
};

export default useEventListener;
