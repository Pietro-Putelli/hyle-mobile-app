import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  content: {
    width: width - 12,
    paddingHorizontal: 12,
  },
  backdrop: {
    width,
    height,
    position: 'absolute',
    backgroundColor: 'black',
  },
  title: {
    flex: 1,
    marginLeft: '2%',
  },
  titleContainer: {
    marginBottom: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
  },
  cursor: {
    height: 4,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: '4%',
    opacity: 0.5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginRight: 8,
  },
});

export default styles;
