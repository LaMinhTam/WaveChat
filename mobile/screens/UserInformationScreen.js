import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ImageBackground,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/auth-context';

const UserInformationScreen = ({navigation}) => {
  const {userInfo, setUserInfo} = useAuth();

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToUserSetting = () => {
    navigation.navigate('Cài đặt');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/bia.jpg')}
        style={styles.coverPage}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              style={styles.touchAble}
              onPress={navigateToUserSetting}>
              <EntypoIcon name="dots-three-horizontal" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchAble}>
              <MaterialIcons name="manage-accounts" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchAble}>
              <FeatherIcon name="phone" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.touchAble} onPress={navigateBack}>
              <FeatherIcon
                name="arrow-left"
                size={20}
                color="#fff"></FeatherIcon>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/img/giiahuy.jpeg')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userInfo.full_name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: '100%',
    position: 'relative',
  },
  coverPage: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    height: '48%',
  },
  profileContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    color: '#000',
  },
  touchAble: {
    padding: 10,
    color: '#fff',
  },
});

export default UserInformationScreen;