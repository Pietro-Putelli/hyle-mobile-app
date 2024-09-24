import {useAppState as useAppStateHook} from '@react-native-community/hooks';
import {useEffect} from 'react';

type CallBackParams = {
  isActive: boolean;
  state: string;
};

const useAppState = (
  callback: (params: CallBackParams) => void,
  dependencies = [],
) => {
  const appState = useAppStateHook();

  useEffect(() => {
    callback({isActive: appState == 'active', state: appState});
  }, [appState, ...dependencies]);
};

export default useAppState;
