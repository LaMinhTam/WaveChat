import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import CallPhoneScreen from '../screens/CallPhoneScreen';
import PrivateChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import {globalScreenOptions} from '../styles';

const Stack = createStackNavigator();

const ConversationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ChatScreen" component={PrivateChatScreen} />
      <Stack.Screen name="CallPhoneScreen" component={CallPhoneScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigator;
