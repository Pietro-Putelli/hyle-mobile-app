import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

const useReachability = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({isConnected}: any) => {
      setIsConnected(isConnected);
    });

    return unsubscribe;
  }, []);

  return isConnected;
};

export default useReachability;
