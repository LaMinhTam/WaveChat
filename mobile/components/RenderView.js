import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAIN_COLOR} from '../styles/styles';
const RenderView = ({user, phoneNumber}) => {
  if (phoneNumber.length < 10) {
    return (
      <View style={styles.container}>
        <Icon name="phone-square" size={48} color={MAIN_COLOR} />
        <Text style={styles.text}>
          Nhập số điện thoại để tìm kiếm người dùng
        </Text>
      </View>
    );
  }
  return (
    <>
      {user === null ? (
        <View style={styles.searchContainer}>
          <Text style={styles.title}>Kết quả tìm kiếm</Text>
          <View style={styles.subContainer}>
            <Icon name="exclamation-triangle" size={48} color={MAIN_COLOR} />
            <Text style={styles.text}>
              Số điện thoại chưa đăng ký tài khoản hoặc không cho phép tìm kiếm
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <View>
            <Text style={styles.title}>Kết quả tìm kiếm</Text>
          </View>
          <TouchableOpacity style={styles.resultContainer}>
            <Image source={{uri: user.user.avatar}} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.user.full_name}</Text>
              <View style={styles.phoneContainer}>
                <Text>Số điện thoại: </Text>
                <Text style={styles.phoneNumber}>{user.user.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Kết bạn</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '4%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchContainer: {
    height: '30%',
    padding: '4%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
  },
  text: {
    padding: '2%',
    fontWeight: '400',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    margin: 15,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '400',
    fontSize: 16,
    color: '#000',
  },
  phoneContainer: {
    flexDirection: 'row',
  },
  phoneNumber: {
    color: '#21e688',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0ffd2',
    borderRadius: 25,
    padding: '2%',
  },
  addButtonText: {
    color: '#1dc071',
    textTransform: 'uppercase',
  },
});

export {RenderView};
