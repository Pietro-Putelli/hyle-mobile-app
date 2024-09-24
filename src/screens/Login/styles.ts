import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const IMAGE_HEIGHT = height * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    height: IMAGE_HEIGHT,
  },
  content2: {
    paddingHorizontal: 16,
    height: height - IMAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  bgImage: {
    height: '100%',
    width,
  },
  gradient: {
    height: 200,
    position: 'absolute',
    zIndex: 10,
    width,
    bottom: 0,
  },
  logo: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
