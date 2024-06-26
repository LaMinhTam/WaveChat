import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';
import {useUserData} from '../contexts/auth-context';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadImageToS3} from '../utils/S3Bucket';
import {removeAccount, updateProfile} from '../apis/user';
import {removeFCMToken} from '../utils/firestoreManage';

const UserSettingListScreen = ({navigation}) => {
  const {userInfo, setUserInfo, accessTokens, removeAccessToken} =
    useUserData();
  const listData = [
    {id: 1, title: 'Thông tin'},
    {id: 2, title: 'Đổi ảnh đại diện'},
    {id: 3, title: 'Đổi ảnh bìa'},
    {id: 5, title: 'Cập nhật mật khẩu'},
    {id: 7, title: 'Danh sách chặn'},
    {id: 4, title: 'Đăng xuất'},
    {id: 6, title: 'Xóa tài khoản'},
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
      case 2:
        ImagePicker.openPicker({
          cropping: true,
          mediaType: 'photo',
        })
          .then(async image => {
            let imageName = 'avatar.' + image.path.split('.').pop();
            image = {
              ...image,
              name: imageName,
            };
            const location = await uploadImageToS3(
              image,
              `profile/${userInfo._id}/`,
            );
            let newUserInfo = {...userInfo, avatar: location};
            setUserInfo(newUserInfo);
            await updateProfile(newUserInfo, accessTokens);
          })
          .catch(error => {});
        break;
      case 3:
        ImagePicker.openPicker({
          cropping: true,
          mediaType: 'photo',
        })
          .then(async image => {
            let imageName = 'cover.' + image.path.split('.').pop();
            image = {
              ...image,
              name: imageName,
            };
            const location = await uploadImageToS3(
              image,
              `profile/${userInfo._id}/`,
            );
            let newUserInfo = {...userInfo, cover: location};
            setUserInfo(newUserInfo);
            await updateProfile(newUserInfo, accessTokens);
          })
          .catch(error => {});
        break;
      case 4:
        // removeFCMToken(userInfo);
        removeAccessToken();
        break;
      case 5:
        navigation.navigate('Cập nhật mật khẩu');
        break;
      case 6:
        const removeMyAccount = async () => {
          const data = await removeAccount(accessTokens);
          console.log(data);
          removeAccessToken();
        };
        removeMyAccount();
      case 7:
        navigation.navigate('Danh sách chặn');
        break;
      default:
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={listData} renderItem={itemRender} />
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
