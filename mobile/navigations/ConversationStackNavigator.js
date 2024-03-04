import {createStackNavigator} from '@react-navigation/stack';
import {default as React, default as React} from 'react';
import {HeaderLeft, HeaderRight, HeaderTitle} from '../components/CustomHeader';
import CallPhoneScreen from '../screens/CallPhoneScreen';
import {
  default as ChatScreen,
  default as PrivateChatScreen,
} from '../screens/ChatScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import {globalScreenOptions} from '../styles';
import {MAIN_COLOR} from '../styles/styles';

const Stack = createStackNavigator();

const ConversationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: MAIN_COLOR},
          headerTitle: () => <HeaderTitle navigation={navigation} />,
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerRight: () => <HeaderRight navigation={navigation} />,
        })}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ChatScreen" component={PrivateChatScreen} />
      <Stack.Screen name="CallPhoneScreen" component={CallPhoneScreen} />
      <Stack.Screen name="GroupCreate" component={CreateGroupScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigator;
