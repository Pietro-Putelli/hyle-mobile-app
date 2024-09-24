import React from 'react';

const useAnimatedVisibility = ({isVisible, delay}: any) => {
  const [visible, setVisible] = React.useState(isVisible);

  React.useEffect(() => {
    if (isVisible) {
      setVisible(true);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, delay ?? 500);
    }
  }, [isVisible]);

  return visible;
};

export default useAnimatedVisibility;
