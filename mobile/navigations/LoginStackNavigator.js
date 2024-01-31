import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {globalScreenOptions} from '../styles';
import AuthenScreen from '../screens/AuthenScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import OTPScreen from '../screens/OTPScreen';
import GenderDOBSelectionScreen from '../screens/GenderDOBSelectionScreen';
import HomeScreen from '../screens/HomeScreen';

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
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'Đăng nhập'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'Tạo tài khoản'}}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{title: 'Nhập mã xác thực'}}
        />
        <Stack.Screen
          name="GenderDOBSelectionScreen"
          component={GenderDOBSelectionScreen}
          options={{title: 'Ngày sinh và giới tính'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginStackNavigator;
