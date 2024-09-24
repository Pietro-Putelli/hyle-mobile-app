import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cell: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  thread: {
    width: 4,
    position: 'absolute',
    zIndex: -1,
    left: 32,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flex: 1,
    marginRight: 16,
  },
  moreIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  originDot: {
    alignSelf: 'center',
    borderRadius: 7,
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 16,
  },
  exampleContainer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  deleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    alignSelf: 'flex-start',
    left: 14.5,
    top: 16.5,
  },
  addButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    borderRadius: 16,
  },
});

export default styles;
