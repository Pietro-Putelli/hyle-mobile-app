import apiHandler from '@/api';
import RouteNames from '@/constants/routeNames';
import {
  pageModalRoutes,
  stackRoutes,
  stackRoutesModal,
} from '@/constants/routes';
import useDelayedEffect from '@/hooks/useDelayedEffect';
import useProfile from '@/hooks/useProfile';
import useTheme from '@/hooks/useTheme';
import i18n from '@/i18n';
import {getSystemLanguage} from '@/i18n/config';
import AddPickStack from '@/navigation/AddPickStack';
import CreateOrAddPickStack from '@/navigation/CreateOrAddPickStack';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import BookDetail from '@/screens/BookDetail';
import Login from '@/screens/Login';
import OnBoarding from '@/screens/OnBoarding';
import Splash from '@/screens/Splash';
import {updateProfileSettings} from '@/storage/slices/profileSlice';
import {store} from '@/storage/store';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import TrackPlayer, {Capability} from 'react-native-track-player';
import {Provider, useDispatch} from 'react-redux';

const Stack = createNativeStackNavigator();

// async function setupPlayer() {
//   await TrackPlayer.setupPlayer({});

//   TrackPlayer.updateOptions({
//     capabilities: [
//       Capability.Play,
//       Capability.Pause,
//       Capability.SkipToNext,
//       Capability.SkipToPrevious,
//       Capability.Stop,
//       Capability.SeekTo,
//     ],
//   });
// }

const linking: any = {
  prefixes: [
    'feynman://',
    'https://feynmanapp.com',
    'https://*.feynmanapp.com',
  ],
  filter: (url: string) => {
    if (/^(https?:\/\/(www\.)?domain\.com)(\/.*)?$/.test(url)) {
      return false;
    } else {
      return true;
    }
  },
  config: {
    initialRouteName: RouteNames.Root,
    screens: {
      BookDetail: {
        path: 'book/:bookId',
        parse: {
          bookId: (id: string) => `${id}`,
        },
      },
    },
  },
};

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(false);

  const {colorScheme, statusBarStyle, colors} = useTheme();

  const {isLogged, settings} = useProfile();
  const appLanguage = settings?.appLanguage;

  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    if (isLogged) {
      /* Complete Singletone Initialization once redux is loaded */
      apiHandler.updateInstance(() => {
        setTimeout(() => {
          setIsAppLoading(true);
        }, 100);
      });
    }
  }, [isLogged]);

  /* Setup App Language */

  useDelayedEffect(() => {
    if (appLanguage == undefined) {
      const preferredLanguage = getSystemLanguage();
      i18n.changeLanguage(preferredLanguage);

      dispatch(
        updateProfileSettings({
          appLanguage: preferredLanguage,
        }),
      );

      i18n.changeLanguage(appLanguage);
    } else {
      i18n.changeLanguage(appLanguage);
    }
  }, 100);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{flex: 1, backgroundColor: colors.background}}>
        <StatusBar barStyle={statusBarStyle} />

        <Splash
          onEndLoading={() => {
            if (!isLogged) {
              setIsAppLoading(true);
            }
          }}
        />

        {isAppLoading && (
          <NavigationContainer
            linking={linking}
            theme={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
              initialRouteName={isLogged ? RouteNames.Root : RouteNames.SignIn}
              screenOptions={{headerShown: false}}>
              <Stack.Screen
                name={RouteNames.Root}
                component={DrawerNavigator}
                options={{headerShown: false, gestureEnabled: false}}
              />

              <Stack.Group>
                {stackRoutes.map(({name, component}) => {
                  return (
                    <Stack.Screen
                      key={name}
                      name={name}
                      component={component}
                    />
                  );
                })}
              </Stack.Group>

              <Stack.Group screenOptions={{presentation: 'fullScreenModal'}}>
                <Stack.Screen
                  name={RouteNames.AddPickStack}
                  component={AddPickStack}
                />

                {stackRoutesModal.map(({name, component, options}: any) => {
                  return (
                    <Stack.Screen
                      key={name}
                      name={name}
                      options={options}
                      component={component}
                    />
                  );
                })}
              </Stack.Group>

              <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen
                  name={RouteNames.CreateOrAddPickStack}
                  component={CreateOrAddPickStack}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name={RouteNames.BookDetailModal}
                  component={BookDetail}
                  options={{headerShown: false}}
                />

                {pageModalRoutes.map(({name, component}) => {
                  return (
                    <Stack.Screen
                      key={name}
                      name={name}
                      component={component}
                    />
                  );
                })}
              </Stack.Group>

              <Stack.Screen
                name={RouteNames.SignIn}
                component={Login}
                options={{
                  animationTypeForReplace: !isLogged ? 'pop' : 'push',
                }}
              />

              <Stack.Screen
                component={OnBoarding}
                name={RouteNames.Onboarding}
                options={{gestureEnabled: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
