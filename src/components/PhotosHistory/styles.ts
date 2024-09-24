import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
export const PHOTO_CELL_SIDE = (width - 12 * 6) / 3;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    gap: 10,
    paddingTop: 32,
  },
  cursor: {
    width: '16%',
    height: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  cell: {
    width: PHOTO_CELL_SIDE,
    height: PHOTO_CELL_SIDE,
  },
});

export default styles;
