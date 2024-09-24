import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const CAMERA_BUTTON_SIDE = 80;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    height: (4 / 2.9) * width,
    overflow: 'hidden',
  },
  cameraButtonOuter: {
    width: CAMERA_BUTTON_SIDE,
    height: CAMERA_BUTTON_SIDE,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CAMERA_BUTTON_SIDE / 2,
  },
  cameraButtonInner: {
    width: '90%',
    height: '90%',
    borderRadius: CAMERA_BUTTON_SIDE * 0.5 * 0.9,
    backgroundColor: 'white',
  },
  bottomContainer: {
    alignItems: 'center',
    height: '21%',
    paddingBottom: 28,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    zIndex: 10,
    paddingTop: 12,
  },
  sideItem: {
    width: 50,
  },
  photosHistory: {
    bottom: 8,
    zIndex: 2,
  },
});

export default styles;
