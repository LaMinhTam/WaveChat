import {View, Text} from 'react-native';
import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
const Stack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="Trang thông tin"
        component={UserInformationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Cài đặt"
        component={UserSettingListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chi tiết người dùng"
        component={UserDetailScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
