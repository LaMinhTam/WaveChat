import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ContactScreen from '../screens/ContactScreen';
import {globalScreenOptions} from '../styles';
import PhoneContacts from '../screens/PhoneContacts';
import FriendRequestTabNavigator from './FriendRequestTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAIN_COLOR} from '../styles/styles';
import {HeaderLeft, HeaderRight, HeaderTitle} from '../components/CustomHeader';
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
    </Stack.Navigator>
  );
};

export default UserStackNavigator;
