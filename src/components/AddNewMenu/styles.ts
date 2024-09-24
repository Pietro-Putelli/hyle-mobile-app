import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');
export const MENU_BUTTON_SIDE = width * 0.17;
const SECONDARY_BUTTON_SIDE = MENU_BUTTON_SIDE * 0.95;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 5,
  },
  content: {
    alignItems: 'center',
  },
  primaryButtonOuter: {
    width: MENU_BUTTON_SIDE,
    height: MENU_BUTTON_SIDE,
    zIndex: 5,
  },
  primaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: MENU_BUTTON_SIDE * 0.45,
    backgroundColor: '#441C78',
    width: '100%',
    height: '100%',
  },
  secondaryButtonOuter: {
    position: 'absolute',
    bottom: 0,
  },
  secondaryButton: {
    width: SECONDARY_BUTTON_SIDE,
    height: SECONDARY_BUTTON_SIDE,
    borderRadius: SECONDARY_BUTTON_SIDE * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    height: 130,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'black',
    zIndex: 3,
    width,
    height,
  },
  cursor: {
    width: 28,
    height: 28,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28 * 0.45,
  },
  pasteButtonOuter: {
    position: 'absolute',
  },
  pasteButton: {
    padding: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default styles;
