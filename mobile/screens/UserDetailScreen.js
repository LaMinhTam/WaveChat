import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useUserData} from '../contexts/auth-context';
import {
  BACKGROUND_COLOR,
  PRIMARY_TEXT_COLOR,
  SECOND_COLOR,
} from '../styles/styles';

const UserDetailScreen = ({navigation}) => {
  const {userInfo} = useUserData();

  const getGender = () => {
    return userInfo.gender === 1 ? 'Nữ' : 'Nam';
  };

  const navigateModificationScreen = () => {
    navigation.navigate('Chỉnh sửa thông tin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <ImageBackground
          source={{uri: userInfo.cover}}
          style={styles.coverPage}>
          <View style={styles.profileContainer}>
            <Image source={{uri: userInfo.avatar}} style={styles.avatar} />
            <Text style={styles.name}>{userInfo.full_name}</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.personalInfo}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: PRIMARY_TEXT_COLOR,
            }}>
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
        <TouchableOpacity
          style={styles.btnModify}
          onPress={navigateModificationScreen}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              fontWeight: '500',
              paddingVertical: 5,
            }}>
            Chỉnh sửa
          </Text>
          <EntypoIcon
            name="pencil"
            size={20}
            style={{color: '#000'}}></EntypoIcon>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: SECOND_COLOR,
  },
  imageSection: {
    flex: 1,
  },
  coverPage: {
    flex: 1,
  },
  itemText: {
    color: PRIMARY_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '500',
  },
  profileContainer: {
    alignItems: 'center',
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
  personalInfo: {
    backgroundColor: '#fff',
    flex: 2,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
  },
  label: {
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
    paddingVertical: 15,
  },
  content: {
    marginLeft: 70,
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
  },
  btnModify: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 70,
    marginTop: 15,
    gap: 10,
  },
});

export default UserDetailScreen;
