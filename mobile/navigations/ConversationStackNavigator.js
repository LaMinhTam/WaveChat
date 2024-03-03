import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import {MAIN_COLOR} from '../styles/styles';
import {HeaderLeft, HeaderRight, HeaderTitle} from '../components/CustomHeader';
import CreateGroupScreen from '../screens/CreateGroupScreen';

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
      <Stack.Screen name="GroupCreate" component={CreateGroupScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigator;
