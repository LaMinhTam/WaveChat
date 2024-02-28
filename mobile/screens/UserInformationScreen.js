import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';

const UserInformationScreen = ({navigation}) => {
  const {userInfo} = useUserData();

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToUserSetting = () => {
    navigation.navigate('Cài đặt');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{uri: userInfo.cover}} style={styles.coverPage}>
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
        <Image source={{uri: userInfo.avatar}} style={styles.avatar} />
        <Text style={styles.name}>{userInfo.full_name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECOND_COLOR,
  },
  coverPage: {
    flex: 1,
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
    color: PRIMARY_TEXT_COLOR,
  },
  touchAble: {
    padding: 10,
    color: '#fff',
  },
});

export default UserInformationScreen;
