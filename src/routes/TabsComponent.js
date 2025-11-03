import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

import Billing from '../views/pages/onBoardScreen/Billing';
import Account from '../views/pages/onBoardScreen/Account';
import DrawerComponent from './DrawerComponents';

const Tab = createBottomTabNavigator();

const TabsComponent = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inventory" // Ensures the 'Home' tab loads first
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#ED8A00',
        tabBarInactiveTintColor: '#9D0C0C',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        // We set headerShown: false here, as the Drawer component handles its own header
        headerShown: false,
      })}>
      {/* 1. FIRST TAB (Left Side): HOME */}
      <Tab.Screen
        name="Inventory"
        component={DrawerComponent} // This contains the nested Drawer Navigator
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#ED8A00' : '#333333',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Home
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <View style={{width: size, height: size, backgroundColor: color}} />
          ),
        }}
      />

      {/* 2. MIDDLE TAB: BILLING */}
      <Tab.Screen
        name="Billing"
        component={Billing}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#ED8A00' : '#333333',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Billing
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <View style={{width: size, height: size, backgroundColor: color}} />
          ),
        }}
      />

      {/* 3. LAST TAB (Right Side): ACCOUNT */}
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#ED8A00' : '#333333',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Account
            </Text>
          ),
          tabBarIcon: ({color, size}) => (
            <View style={{width: size, height: size, backgroundColor: color}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsComponent;
