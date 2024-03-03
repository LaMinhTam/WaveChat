import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {globalScreenOptions} from '../styles';
import HomeScreen from '../screens/HomeScreen';
import PrivateChatScreen from '../screens/ChatScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchScreen from '../screens/SearchScreen';
import {MAIN_COLOR} from '../styles/styles';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
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
      <Stack.Screen name="ChatScreen" component={PrivateChatScreen} />
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
