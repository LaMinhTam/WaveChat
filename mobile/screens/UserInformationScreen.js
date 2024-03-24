import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';
import {getProfile} from '../apis/user';

const UserInformationScreen = ({navigation, route}) => {
  const {userInfo, accessTokens} = useUserData();
  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    if (route.params?.userIds) {
      const getUserProfile = async () => {
        const id = route.params?.userIds.filter(id => id !== userInfo._id);
        const response = await getProfile(id[0], accessTokens);
        setUserData(response.data);
      };
      getUserProfile();
    }
  }, []);

  const navigateToUserSetting = () => {
    navigation.navigate('Cài đặt');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: userData
            ? userData.cover
            : userInfo.cover
            ? userInfo.cover
            : `https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg`,
        }}
        style={styles.coverPage}>
        <View style={styles.header}>
          {!userData && (
            <TouchableOpacity
              style={styles.touchable}
              onPress={navigateToUserSetting}>
              <EntypoIcon name="dots-three-horizontal" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: userData
              ? userData.avatar
              : userInfo.avatar
              ? userInfo.avatar
              : `https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {userData ? userData.full_name : userInfo.full_name}
        </Text>
        <View style={styles.detailsContainer}>
          <DetailItem
            label="Ngày sinh"
            value={userData ? userData.birthday : userInfo.birthday}
          />
          <DetailItem
            label="Giới tính"
            value={
              userData
                ? userData.gender === 1
                  ? 'Nữ'
                  : 'Nam'
                : userInfo.gender === 1
                ? 'Nữ'
                : 'Nam'
            }
          />
          <DetailItem
            label="Số điện thoại"
            value={userData ? userData.phone : userInfo.phone}
          />
        </View>
      </View>
    </View>
  );
};

const DetailItem = ({label, value}) => {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  touchable: {
    padding: 10,
    color: '#fff',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: PRIMARY_TEXT_COLOR,
  },
  name: {
    fontSize: 24,
    color: PRIMARY_TEXT_COLOR,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
    width: '50%',
  },
  detailValue: {
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
    flex: 1,
  },
});

export default UserInformationScreen;
