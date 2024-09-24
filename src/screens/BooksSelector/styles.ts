import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
export const NEXT_BUTTON_SIDE = width / 5.8;

const styles = StyleSheet.create({
  container: {flex: 1, paddingBottom: 0, paddingHorizontal: 0},
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ffffff20',
    paddingBottom: 8,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    gap: 16,
    paddingVertical: 20,
    width: '100%',
  },
  nextButton: {
    width: '100%',
    height: NEXT_BUTTON_SIDE * 0.8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});

export default styles;
