import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// --- Screen Imports ---
import Orders from '../views/pages/onBoardScreen/Orders';
import Reports from '../views/pages/onBoardScreen/Reports';
import Manage from '../views/pages/onBoardScreen/Manage';
import Dashboard from '../views/pages/onBoardScreen/Dashboard';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// --- Dashboard Stack (Wraps the main Dashboard view for optional header/stack) ---
const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

// --- Custom Drawer Content ---
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <Text style={{padding: 20, fontSize: 18, fontWeight: '600'}}>My App</Text>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        // ✅ FIX: Use replace() to exit the main app flow and return to Login
        onPress={() => props.navigation.replace('LoginScreen')}
        icon={({color, size}) => (
          <Ionicons name="log-out-outline" size={22} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
}

// --- Main Drawer Component ---
const DrawerComponent = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: 'blue',
        drawerInactiveTintColor: 'gray',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="DashboardHome" // ✅ FIX: Clearer name for the Drawer's home screen
        component={DashboardStack} // Use the stack wrapper
        options={{
          title: 'Home',
          drawerIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      {/* ... Other Drawer Screens ... */}
      <Drawer.Screen
        name="Orders"
        component={Orders}
        options={{
          title: 'Orders',
          drawerIcon: ({color}) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={Reports}
        options={{
          title: 'Reports',
          drawerIcon: ({color}) => (
            <Ionicons name="bar-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage"
        component={Manage}
        options={{
          title: 'Manage',
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerComponent;
