import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ContactScreen from '../screens/ContactScreen';
import {globalScreenOptions} from '../styles';
import PhoneContacts from '../screens/PhoneContacts';
import FriendRequestTabNavigator from './FriendRequestTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import {MAIN_COLOR} from '../styles/styles';
import {HeaderLeft, HeaderRight, HeaderTitle} from '../components/CustomHeader';
import ChatControlPanel from '../screens/ChatControlPanel';
import UserInformationScreen from '../screens/UserInformationScreen';
import ImagesScreen from '../screens/ImagesScreen';
const Stack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: MAIN_COLOR},
          headerTitle: () => <HeaderTitle navigation={navigation} />,
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerRight: () => <HeaderRight />,
        })}
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
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen
        name="ChatControlPanel"
        component={ChatControlPanel}
        options={{headerTitle: 'Tùy chọn'}}
      />
      <Stack.Screen
        name="UserInfomation"
        component={UserInformationScreen}
        options={{headerTitle: 'Hồ sơ'}}
      />
      <Stack.Screen
        name="ImagesScreen"
        component={ImagesScreen}
        options={{headerTitle: 'Ảnh'}}
      />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
