import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserStackNavigator from './UserStackNavigator';
import ContactStackNavigator from './ContactStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import HeaderStackNavigator from './HeaderStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [showHeaderLeft, setShowHeaderLeft] = useState(false);

  const toggleHeaderLeft = () => {
    setShowHeaderLeft(!showHeaderLeft);
  };

  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        // Header config
        headerStyle: {backgroundColor: '#1DC071'},
        headerTintColor: '#fff',
        headerTitle: () => (
          <View>
            <TouchableOpacity
              onPress={() => {navigation.navigate('../screens/SearchScreen')}}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                backgroundColor: '#1DC071',
                borderRadius: 15,
              }}>
              <TextInput
                placeholder="Tìm kiếm"
                placeholderTextColor="#f3e7fd"
                style={{color: 'white', fontSize: 16}}
                onFocus={() => {
                  setShowHeaderLeft(true);
                }}
              />
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              toggleHeaderLeft();
            }}>
            <Icon
              name="search"
              size={24}
              color="#fff"
              style={{paddingHorizontal: '5%'}}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notification');
            }}>
            <Icon
              name="plus"
              size={24}
              color="#fff"
              style={{paddingHorizontal: '5%'}}
            />
          </TouchableOpacity>
        ),

        // Tab config
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: '#1DC071',
        swipeEnabled: true,
        tabBarPressColor: '#f3e7fd',

        tabBarLabel: navigation.isFocused() ? route.name : '',

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
              <Text>
                <Icon
                  name={iconName}
                  size={24}
                  color={focused ? '#1DC071' : 'grey'}
                />
                ;
              </Text>
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
      <Tab.Screen name="Tin nhắn" component={HomeScreen} />
      <Tab.Screen name="Danh bạ" component={ContactStackNavigator} />
      <Tab.Screen
        name="Cá nhân"
        component={UserStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Search" component={HeaderStackNavigator} options={{headerShown: false}}/>
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
