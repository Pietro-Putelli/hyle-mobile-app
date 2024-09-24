import {MENU_BUTTON_SIDE} from '@/components/AddNewMenu/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginRight: 4,
    paddingHorizontal: 6,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
  },
  closeTopButton: {
    height: 50,
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#C02A1B',
    width: MENU_BUTTON_SIDE,
    height: MENU_BUTTON_SIDE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: MENU_BUTTON_SIDE * 0.45,
  },
  list: {
    marginTop: 8,
    flex: 1,
    marginBottom: 12,
  },
  loader: {
    position: 'absolute',
    marginTop: '24%',
    width: '100%',
    alignItems: 'center',
  },
  searchContainer: {
    height: 54,
    flexDirection: 'row',
    gap: 12,
  },
});

export default styles;
