import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import UserModificationScreen from '../screens/UserModificationScreen';
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
      <Stack.Screen
        name="Chỉnh sửa thông tin"
        component={UserModificationScreen}/>
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
