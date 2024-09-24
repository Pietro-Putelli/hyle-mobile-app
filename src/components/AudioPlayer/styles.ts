import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  outer: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
    top: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    height: 50,
    gap: 12,
  },
  downloadingContainer: {
    height: 50,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  closeButton: {
    height: '100%',
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    height: '100%',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  outerProgress: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#d9d9d910',
    position: 'absolute',
    overflow: 'hidden',
    zIndex: -1,
  },
  progress: {
    opacity: 0.3,
    height: '100%',
  },
  trackButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextTrackButton: {
    transform: [{scale: 0.8}],
    height: 40,
    justifyContent: 'center',
  },
  prevTrackButton: {
    transform: [{rotate: '180deg'}, {scale: 0.8}],
    height: 40,
    justifyContent: 'center',
  },
  timeContainer: {
    width: 45,
    alignItems: 'center',
  },
});

export default styles;
