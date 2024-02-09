import {View, Text} from 'react-native';
import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserSettingListScreen from '../screens/UserSettingListScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ContactScreen from '../screens/ContactScreen';
import {globalScreenOptions} from '../styles';
import FriendRequest from '../screens/FriendRequest';
import PhoneContacts from '../screens/PhoneContacts';
import FriendRequestTabNavigator from './FriendRequestTabNavigator';
import PrivateChatScreen from '../screens/ChatScreen';
const Stack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequestTabNavigator}
        options={{title: 'Lời mời kết bạn'}}
      />
      <Stack.Screen
        name="PhoneContacts"
        component={PhoneContacts}
        options={{title: 'Danh bạ máy'}}
      />
      <Stack.Screen name="ChatScreen" component={PrivateChatScreen} />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
