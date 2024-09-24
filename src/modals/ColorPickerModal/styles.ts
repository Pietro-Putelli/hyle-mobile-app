import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const SIDE = (width - 24 - 16) / 4;

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
  },
  cellOuter: {
    padding: 6,
    width: SIDE,
    height: SIDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: '100%',
    height: '100%',
    borderRadius: SIDE * 0.38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
