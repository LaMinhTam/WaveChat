import React, { useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { globalScreenOptions } from '../styles';
import HomeScreen from '../screens/HomeScreen';
import PrivateChatScreen from '../screens/ChatScreen';
const Stack = createStackNavigator();

const ConversationStackNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    if (route.state && route.state.index > 0) {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
      console.log('tabBarVisible', true);
    }
  }, [navigation, route.state]);

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatScreen" component={PrivateChatScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigator;
