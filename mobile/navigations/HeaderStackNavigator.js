import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import UserModificationScreen from '../screens/UserModificationScreen';
import SearchScreen from '../screens/SearchScreen';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createStackNavigator();

const HeaderStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="Trang tìm kiếm"
        component={SearchScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HeaderStackNavigator;
