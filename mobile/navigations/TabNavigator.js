import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserStackNavigator from './UserStackNavigator';
import ContactStackNavigator from './ContactStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import HeaderStackNavigator from './HeaderStackNavigator';
import ConversationStackNavigator from './ConversationStackNavigator';
import {useIsFocused} from '@react-navigation/native';
import {MAIN_COLOR} from '../styles/styles';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isFocused = useIsFocused();
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        // Header config
        headerStyle: {backgroundColor: MAIN_COLOR},
        headerTitle: () => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Search');
              }}
              style={{width: '80%'}}>
              <Text style={{color: 'white', fontSize: 16}}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Search');
              }}>
              <Icon
                name="search"
                size={26}
                color="#fff"
                style={{paddingHorizontal: '5%'}}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <Icon
                name="qrcode"
                size={30}
                color="#fff"
                style={{paddingHorizontal: '5%'}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Icon
                name="plus"
                size={30}
                color="#fff"
                style={{paddingHorizontal: '5%'}}
              />
            </TouchableOpacity>
          </View>
        ),

        // Tab config
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: MAIN_COLOR,
        swipeEnabled: true,
        tabBarPressColor: '#f3e7fd',
        tabBarHideOnKeyboard: true,
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
        options={{
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Danh bạ"
        component={ContactStackNavigator}
        options={{headerShown: true}}
      />
      <Tab.Screen
        name="Cá nhân"
        component={UserStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Search"
        component={HeaderStackNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});

export default TabNavigator;
