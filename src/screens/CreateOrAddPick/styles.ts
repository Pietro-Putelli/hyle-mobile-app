import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 12,
    marginBottom: 8,
    alignSelf: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  title: {
    marginHorizontal: 2,
  },
  inputContainer: {
    gap: 16,
  },
  inputOuter: {
    padding: 16,
    borderRadius: 16,
  },
  cursor: {
    height: 4,
    width: 100,
    borderRadius: 16,
    alignSelf: 'center',
    opacity: 0.5,
    marginBottom: 20,
  },
});

export default styles;
