import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  SendFriendRequest,
  ReceiveFriendRequest,
} from '../screens/FriendRequest';
import {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Tab = createMaterialTopTabNavigator();

function FriendRequestTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: '#13f287',
        },
        tabBarPressColor: 'transparent',
      }}>
      <Tab.Screen name="receiveRequest" component={ReceiveFriendRequest} />
      <Tab.Screen name="sendRequest" component={SendFriendRequest} />
    </Tab.Navigator>
  );
}

export default FriendRequestTabNavigator;
