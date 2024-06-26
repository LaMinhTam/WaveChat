import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import UserModificationScreen from '../screens/UserModificationScreen';
import {useUserData} from '../contexts/auth-context';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import BlockScreen from '../screens/BlockScreen';
const Stack = createStackNavigator();

const UserStackNavigator = () => {
  const {userInfo} = useUserData();

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
        options={{headerTitle: userInfo.full_name}}
      />
      <Stack.Screen
        name="Chi tiết người dùng"
        component={UserDetailScreen}
        options={{headerTransparent: true, headerTitle: ''}}
      />
      <Stack.Screen
        name="Chỉnh sửa thông tin"
        component={UserModificationScreen}
      />
      <Stack.Screen name="Cập nhật mật khẩu" component={ChangePasswordScreen} />
      <Stack.Screen name="Danh sách chặn" component={BlockScreen} />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
