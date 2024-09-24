import {useEffect} from 'react';

const useDelayedEffect = (effect: () => void, delay: number) => {
  useEffect(() => {
    const timeout = setTimeout(effect, delay);

    return () => clearTimeout(timeout);
  }, [effect, delay]);
};

export default useDelayedEffect;
