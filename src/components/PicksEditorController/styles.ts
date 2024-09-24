import {Dimensions, StyleSheet} from 'react-native';
import {MENU_BUTTON_SIDE} from '../AddNewMenu/styles';

const {height} = Dimensions.get('window');
export const PICKS_EDITOR_HEIGHT = height * 0.12;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    gap: 16,
    paddingTop: 16,
    width: '100%',
  },
  actionButton: {
    marginRight: 12,
  },
  floatingAdd: {
    borderRadius: (MENU_BUTTON_SIDE - 2) * 0.45,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    width: MENU_BUTTON_SIDE - 2,
    height: MENU_BUTTON_SIDE - 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: '50%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff50',
    marginRight: 14,
    marginLeft: 4,
  },
});

export default styles;
