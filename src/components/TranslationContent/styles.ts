import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 26,
    zIndex: 2,
    borderRadius: 16,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  top: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 32,
  },
  keyword: {
    padding: 8,
    borderRadius: 12,
  },
  translation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    marginTop: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
    opacity: 0.2,
    marginBottom: 16,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 16,
    paddingRight: 13,
    borderRadius: 14,
    gap: 8,
  },
});

export default styles;
