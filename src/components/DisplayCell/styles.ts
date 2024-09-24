import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowOpacity: 0,
  },
  icon: {
    marginRight: 10,
    transform: [{scale: 0.95}],
  },
  segue: {
    opacity: 0.6,
    marginLeft: 12,
  },
  menuIcon: {
    opacity: 0.6,
    transform: [{scale: 0.9}],
  },
});

export default styles;
