import {addPickRoutes} from '@/constants/routes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const AddPickStack = ({route}: any) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={addPickRoutes[0].name}>
      {addPickRoutes.map(({name, component}) => {
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

export default AddPickStack;
