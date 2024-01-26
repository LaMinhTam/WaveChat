import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {globalScreenOptions} from '../styles';
import AuthenScreen from '../screens/AuthenScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import OTPScreen from '../screens/OTPScreen';
import GenderDOBSelectionScreen from '../screens/GenderDOBSelectionScreen';

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen
          name="authenNavigation"
          component={AuthenScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Đăng nhập" component={SignIn} />
        <Stack.Screen name="Tạo tài khoản" component={SignUp} />
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
