import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {globalScreenOptions} from '../styles';
import AuthenScreen from '../screens/AuthenScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import UserInformationSreen from '../screens/UserInformationScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import OTPScreen from '../screens/OTPScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import GenderDOBSelectionScreen from '../screens/GenderDOBSelectionScreen';
import {useAuth} from '../contexts/auth-context';


const Stack = createStackNavigator();

const LoginStackNavigator = () => {


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions} >
      <Stack.Screen
          name="authenNavigation"
          component={AuthenScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Đăng nhập" component={SignIn} />
        <Stack.Screen name='Trang thông tin' component={UserInformationSreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Cài đặt" component={UserSettingListScreen} options={{headerShown: false}} />
        <Stack.Screen name="Chi tiết người dùng" component={UserDetailScreen}  options={{ headerShown: false}}/>
        <Stack.Screen name="Tạo tài khoản" component={SignUp}  />
        <Stack.Screen
          name="Nhập mã xác thực"
          component={OTPScreen}></Stack.Screen>
        <Stack.Screen
          name="Ngày sinh và giới tính"
          component={GenderDOBSelectionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginStackNavigator;
