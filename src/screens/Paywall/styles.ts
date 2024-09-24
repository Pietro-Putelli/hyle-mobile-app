import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bgImage: {
    height: '100%',
    width,
  },
  gradient: {
    height: '100%',
    position: 'absolute',
    zIndex: 10,
    width,
    justifyContent: 'flex-end',
  },
  pictureContainer: {
    flex: 1,
    marginBottom: 32,
  },
  info: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  // title: {
  //   position: 'absolute',
  //   bottom: 8,
  //   zIndex: 20,
  //   left: 16,
  // },
});

export default styles;
