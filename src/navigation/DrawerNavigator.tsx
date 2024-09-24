import DrawerMenu from '@/components/DrawerMenu';
import {drawerRoutes} from '@/constants/routes';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerMenu {...props} />}
      screenOptions={{
        headerShown: false,
        overlayColor: '#36353530',
        drawerStyle: {
          width: '75%',
        },
      }}
      initialRouteName={drawerRoutes[0].name}>
      {drawerRoutes.map(({name, component}) => {
        return <Drawer.Screen key={name} name={name} component={component} />;
      })}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
