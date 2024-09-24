import {createOrAddPickRoutes} from '@/constants/routes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const CreateOrAddPickStack = ({route}: any) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={createOrAddPickRoutes[0].name}>
      {createOrAddPickRoutes.map(({name, component}) => {
        return (
          <Stack.Screen
            initialParams={route.params}
            key={name}
            name={name}
            component={component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default CreateOrAddPickStack;
