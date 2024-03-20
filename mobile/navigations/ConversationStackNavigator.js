import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {HeaderLeft, HeaderRight, HeaderTitle} from '../components/CustomHeader';
import CallPhoneScreen from '../screens/CallPhoneScreen';
import ChatScreen from '../screens/ChatScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import {globalScreenOptions} from '../styles';
import {MAIN_COLOR} from '../styles/styles';
import ChatControlPanel from '../screens/ChatControlPanel';
import UserInformationScreen from '../screens/UserInformationScreen';
import ImagesScreen from '../screens/ImagesScreen';

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
      <Stack.Screen name="CallPhoneScreen" component={CallPhoneScreen} />
      <Stack.Screen name="GroupCreate" component={CreateGroupScreen} />
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

export default ConversationStackNavigator;
