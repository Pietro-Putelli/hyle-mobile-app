import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cell: {
    padding: 24,
  },
  content: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  moreIcon: {
    top: -4,
    right: -6,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordsContainer: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picksCount: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: '#fff',
  },
  authorContainer: {
    marginLeft: 2,
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});

export default styles;
