import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';

const UserSettingListScreen = ({navigation}) => {
  const listData = [
    {id: 1, title: 'Thông tin'},
    {id: 2, title: 'Đổi ảnh đại diện'},
    {id: 3, title: 'Đổi ảnh bìa'},
    {id: 4, title: 'Cập nhật giới thiệu bản thân'},
  ];

  const listDataSetting = [
    {id: 5, title: 'Mã QR của tôi'},
    {id: 6, title: 'Quyền riêng tư'},
    {id: 7, title: 'Quản lý tài khoản'},
    {id: 8, title: 'Cài đặt chung'},
  ];

  const itemRender = ({item}) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handlePress = item => {
    switch (item.id) {
      case 1:
        navigation.navigate('Chi tiết người dùng');
        break;
      case 'value2':
        break;
      default:
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={listData} renderItem={itemRender} />
      <Text
        style={{
          color: MAIN_COLOR,
          fontSize: 20,
          fontWeight: '700',
          paddingLeft: 10,
        }}>
        Cài đặt
      </Text>
      <FlatList data={listDataSetting} renderItem={itemRender} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: SECOND_COLOR,
    height: '100%',
  },
  item: {
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
  },
  itemText: {
    color: PRIMARY_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserSettingListScreen;
