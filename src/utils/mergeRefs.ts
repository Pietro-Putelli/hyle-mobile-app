import React, {ForwardedRef} from 'react';

type Ref<T> =
  | ((instance: T | null) => void)
  | React.MutableRefObject<T | null>
  | ForwardedRef<T>
  | null;

const mergeRefs = <T>(...refs: Ref<T>[]): ((instance: T | null) => void) => {
  return instance => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
};

export default mergeRefs;
