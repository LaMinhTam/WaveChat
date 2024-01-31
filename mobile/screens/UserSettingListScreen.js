import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button, Image, ImageBackground, SafeAreaView, FlatList} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {useAuth} from '../contexts/auth-context';
import { Switch } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';




const UserSettingListScreen = ({navigation}) => {
    const {userInfo, setUserInfo} = useAuth(); 
    const listData = [
        {id: 1, title: 'Thông tin'},
        {id: 2, title: 'Đổi ảnh đại diện'},
        {id: 3, title: 'Đổi ảnh bìa'},
        {id: 4, title: 'Cập nhật giới thiệu bản thân'},
    ]

    const listDataSetting = [
        {id: 5, title: 'Mã QR của tôi'},
        {id: 6, title: 'Quyền riêng tư'},
        {id: 7, title: 'Quản lý tài khoản'},
        {id: 8, title: 'Cài đặt chung'},
    ]

    const itemRender = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      );
    
    const handlePress = (item) => {
        switch (item.id) {
            case 1:
              navigation.navigate('Chi tiết người dùng');
              break;
            case 'value2':
              // Thực hiện hành động khi biến có giá trị là 'value2'
              break;
            default:
              // Thực hiện hành động mặc định khi không có case nào phù hợp
          }
          
    }
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.touchAble} onPress={()=>{navigation.goBack()}}>
              <FeatherIcon name="arrow-left" size={20} color='#fff'></FeatherIcon>
            </TouchableOpacity>
            <Text style={{fontSize: 20, fontWeight: '500', color: '#fff', marginTop: 5}}>{userInfo.full_name}</Text>
        </View>
        <FlatList data={listData} renderItem={itemRender}/>
          <Text style={{color: '#1dc071', fontSize: 20, fontWeight: '700', paddingLeft: 10}}>Cài đặt</Text>
        <FlatList data={listDataSetting} renderItem={itemRender} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: '100%',
  },
  header: {
    backgroundColor: '#1dc071',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  item: {
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 0.2,
  },
  itemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  touchAble: {
    padding: 10,
    marginRight: 10,
    color: '#fff',
  },
});

export default UserSettingListScreen;
