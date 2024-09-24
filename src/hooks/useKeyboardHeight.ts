import {useEffect, useState} from 'react';

import {Keyboard, KeyboardEvent} from 'react-native';

function useKeyboard() {
  const [_keyboardHeight, _setKeyboardHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardShow(event: KeyboardEvent) {
    setKeyboardHeight(event.endCoordinates.height);
    _setKeyboardHeight(event.endCoordinates.height);
  }

  function onKeyboardHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const onHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible: _keyboardHeight > 0,
  };
}

export default useKeyboard;
