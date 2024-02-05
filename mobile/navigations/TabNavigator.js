import {View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserStackNavigator from './UserStackNavigator';
import ContactStackNavigator from './ContactStackNavigator';
import ConversationStackNavigator from './ConversationStackNavigator';
import {useIsFocused} from '@react-navigation/native';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isFocused = useIsFocused();
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: '#1DC071',
        swipeEnabled: true,
        tabBarPressColor: '#f3e7fd',

        tabBarLabel: navigation.isFocused() ? route.name : '',

        tabBarShowLabel: isFocused,
        tabBarIcon: ({focused, color}) => {
          let iconName;
          let count = 0;

          switch (route.name) {
            case 'Tin nhắn': {
              iconName = 'envelope';
              //   count = commonFuc.totalNumberUnread(conversations);

              break;
            }
            case 'Danh bạ': {
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
            <View style={{flex: 1, marginTop: 4}}>
              <View>
                <Icon
                  name={iconName}
                  size={24}
                  color={focused ? '#1DC071' : 'grey'}
                />
              </View>
              {/* {count > 0 && (
                <>
                  <View style={styles.iconBadge}>
                    <Icon name="rightcircle" size={30} color="#900" />;
                    <Text style={styles.badgeElement}>
                      {count > 99 ? 'N' : count}
                    </Text>
                  </View>
                </>
              )} */}
            </View>
          );
        },
      })}>
      <Tab.Screen
        name="Tin nhắn"
        component={ConversationStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Danh bạ"
        component={ContactStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Cá nhân"
        component={UserStackNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
