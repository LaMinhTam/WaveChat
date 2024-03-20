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
import {updateProfile} from '../apis/user';

const UserSettingListScreen = ({navigation}) => {
  const {userInfo, setUserInfo, accessTokens, removeAccessToken} =
    useUserData();
  const listData = [
    {id: 1, title: 'Thông tin'},
    {id: 2, title: 'Đổi ảnh đại diện'},
    {id: 3, title: 'Đổi ảnh bìa'},
    {id: 4, title: 'Đăng xuất'},
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
            await updateProfile(newUserInfo, imageName);
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
            await updateProfile(newUserInfo, imageName);
          })
          .catch(error => {});
        break;
      case 4:
        removeAccessToken();
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
