import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import HomeScreen from '../screens/HomeScreen';
import PrivateChatScreen from '../screens/ChatScreen';

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
    </Stack.Navigator>
  );
};

export default ConversationStackNavigator;
