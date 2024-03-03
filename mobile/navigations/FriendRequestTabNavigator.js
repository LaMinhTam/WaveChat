import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  SendFriendRequest,
  ReceiveFriendRequest,
} from '../screens/FriendRequest';

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
