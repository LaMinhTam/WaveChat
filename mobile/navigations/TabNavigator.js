import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MeScreen from '../screens/MeScreen';
import ContactScreen from '../screens/ContactScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: '#1DC071',
        tabBarInactiveTintColor: 'grey',
        swipeEnabled: true,
        tabBarPressColor: '#f3e7fd',

        // tabBarLabel: navigation.isFocused() ? route.name : "",
        tabBarLabel: ({focused, color}) => {
          return <Text style={{color}}>{route.name}</Text>;
        },

        tabBarShowLabel: navigation.isFocused(),
        tabBarIcon: ({focused, color}) => {
          let iconName;
          let count = 0;

          switch (route.name) {
            case 'Tin nhắn': {
              iconName = 'envelope';
              //   count = commonFuc.totalNumberUnread(conversations);

              break;
            }
            case 'Bạn bè': {
              iconName = 'address-book';
              //   count = friendRequests?.length || 0;
              break;
            }
            case 'Cá nhân': {
              iconName = 'user';
              count = 0;
              break;
            }
            default:
              iconName = 'envelope';
              count = 99;
              break;
          }
          return (
            <View style={{flex: 1}}>
              <Text>
                <Icon name="rocket" size={30} color="#900" />;
              </Text>
              {count > 0 && (
                <>
                  <View style={styles.iconBadge}>
                    <Icon name="rightcircle" size={30} color="#900" />;
                    <Text style={styles.badgeElement}>
                      {count > 99 ? 'N' : count}
                    </Text>
                  </View>
                </>
              )}
            </View>
          );
        },
      })}>
      <Tab.Screen name="Tin nhắn" component={HomeScreen} />
      <Tab.Screen name="Bạn bè" component={ContactScreen} />
      <Tab.Screen name="Cá nhân" component={MeScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
