import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAIN_COLOR} from '../styles/styles';
import {
  acceptFriendRequest,
  revokeFriendRequest,
  sendFriendRequest,
} from '../apis/friend';
import {useUserData} from '../contexts/auth-context';

const RenderView = ({user, phoneNumber}) => {
  const {accessTokens, friends, setFriends} = useUserData();
  let buttonTitle = 'Kết bạn';
  let onPressButton = () => handleSendFriendRequest();

  const exist = friends.find(
    friend => user && friend.user_id === user.user._id,
  );

  if (user && exist) {
    if (exist.contact_type == 3) {
      buttonTitle = 'THU HỒI';
      onPressButton = () => handleRevokeFriendRequest(exist.user_id);
    } else if (exist.contact_type == 2) {
      buttonTitle = 'CHẤP NHẬN';
      onPressButton = () => handleAcceptFriendRequest(exist.user_id);
    } else {
      buttonTitle = 'NHẮN TIN';
      onPressButton = () => {};
    }
  }

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

  const handleSendFriendRequest = async () => {
    const data = await sendFriendRequest(user.user._id, accessTokens);

    if (data.status === 200) {
      friendFormatted = {...user.user, user_id: user.user._id, contact_type: 3};
      setFriends(prevFriends => [...prevFriends, friendFormatted]);
    }
  };

  const handleRevokeFriendRequest = async friendId => {
    const data = await revokeFriendRequest(friendId, accessTokens);

    if (data.status === 200) {
      setFriends(prevFriends =>
        prevFriends.filter(friend => friend.user_id !== friendId),
      );
    }
  };

  const handleAcceptFriendRequest = async friendId => {
    const data = await acceptFriendRequest(friendId, accessTokens);
    if (data.status === 200) {
      setFriends(prevFriends =>
        prevFriends.map(friend =>
          friend.user_id === friendId ? {...friend, contact_type: 4} : friend,
        ),
      );
    }
  };

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
                <Text style={styles.phoneNumber}>{user.user.phone}</Text>
              </View>
            </View>
            {buttonTitle ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={onPressButton}>
                <Text style={styles.addButtonText}>{buttonTitle}</Text>
              </TouchableOpacity>
            ) : null}
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
