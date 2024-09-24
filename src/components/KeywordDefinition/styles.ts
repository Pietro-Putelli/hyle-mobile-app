import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: width - 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: -6,
  },
  keyword: {
    padding: 10,
    borderRadius: 12,
  },
  content: {
    marginTop: 20,
  },
  sources: {
    marginTop: 20,
    width: '100%',
  },
  sourcesList: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceItem: {
    padding: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  favIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});

export default styles;
