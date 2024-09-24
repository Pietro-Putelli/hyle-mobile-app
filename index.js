import {AppRegistry, LogBox} from 'react-native';
import 'react-native-gesture-handler';
// import {withIAPContext} from 'react-native-iap';
import App from './App';
import {name as appName} from './app.json';
import './src/i18n';

// AppRegistry.registerComponent(appName, () => withIAPContext(App));
AppRegistry.registerComponent(appName, () => App);

// TrackPlayer.registerPlaybackService(() => PlaybackService);

LogBox.ignoreLogs([
  "Looks like you're trying to use RecyclerListView's layout animation render while doing pagination. This operation will be ignored to avoid creation of too many items due to developer error.",
]);
