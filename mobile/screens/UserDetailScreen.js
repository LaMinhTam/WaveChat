import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/auth-context';

const UserDetailScreen = ({navigation}) => {
  const {userInfo, setUserInfo} = useAuth();

  const getGender = () => {
    return userInfo.gender === 1 ? 'Nam' : 'Nữ';
  };

  const handleModify = () => {
    // Handle modify button press
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageSection}>
        <ImageBackground
          source={require('../assets/img/bia.jpg')}
          style={styles.coverPage}
          resizeMode="cover">
          <View
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity style={styles.touchAble} onPress={{}}>
                <EntypoIcon name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.touchAble}
                onPress={() => {
                  navigation.goBack();
                }}>
                <FeatherIcon
                  name="arrow-left"
                  size={20}
                  color="#fff"></FeatherIcon>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <Image
              source={require('../assets/img/giiahuy.jpeg')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userInfo.full_name}</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.peronalInfo}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: '500', color: '#000'}}>
              Thông tin cá nhân
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Giới tính</Text>
            <Text style={styles.content}> {getGender()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày sinh</Text>
            <Text style={styles.content}>{userInfo.birthday}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Điện thoại</Text>
            <Text style={styles.content}>{userInfo.phone}</Text>
          </View>
        <TouchableOpacity style={styles.btnModify}>
          <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
            Chỉnh sửa
          </Text>
          <EntypoIcon name="pencil" size={20} style={{color: '#000'}}></EntypoIcon>
        </TouchableOpacity>
        </View>

      <View style={styles.footer}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  imageSection: {
    flex: 1,
  },
  coverPage: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  itemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    margin: 15,
  },
  name: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },

  touchAble: {
    padding: 10,
    color: '#fff',
  },
  // Thông tin cá nhân
  peronalInfo: {
    flex: 2,
    margin: 15,
  },
  // Dòng
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  // Label
  label: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 15,
  },
  // Content
  content: {
    marginLeft: 70,
    fontSize: 16,
    color: '#000',
  },
  // Button chỉnh sửa
  btnModify: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    backgroundColor: '#eef0f1',
    borderRadius: 70,
    marginTop: 15,
  },

  // Phần còn lại
  footer: {
    flex: 1.5,
    backgroundColor: '#eef0f1',
  },
});

export default UserDetailScreen;
