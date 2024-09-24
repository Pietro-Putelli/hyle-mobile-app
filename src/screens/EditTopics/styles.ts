import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  cell: {
    height: 48,
    paddingLeft: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editCell: {
    height: 48,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 12,
  },
  input: {
    marginTop: 8,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingLeft: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  removeButton: {
    transform: [{scale: 0.9}],
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 6,
  },
  doneButton: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});

export default styles;
