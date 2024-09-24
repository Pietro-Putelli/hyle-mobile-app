import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  header: {
    paddingTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  body: {
    marginTop: 32,
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 4,
  },
  menuCell: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 8,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 30,
    height: 30,
  },
});

export default styles;
