import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginTop: 4,
  },
  cell: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cellCounter: {
    borderRadius: 8,
    width: 24,
    height: 24,
    paddingLeft: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCell: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
  },
  filterCellContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  separator: {
    height: '50%',
    width: 1,
    marginRight: 14,
    marginLeft: 4,
  },
});

export default styles;
