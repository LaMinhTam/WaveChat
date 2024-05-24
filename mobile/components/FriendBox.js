import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {
  acceptFriendRequest,
  revokeFriendRequest,
  sendFriendRequest,
} from '../apis/friend';

const FriendBox = (user, friends, setFriends, accessTokens) => {
  let buttonTitle = 'Kết bạn';
  const exist = friends.find(friend => friend.user_id === user._id);
  let onPressButton = () => handleSendFriendRequest();
  const handleSendFriendRequest = async () => {
    const data = await sendFriendRequest(user._id, accessTokens);

    if (data.status === 200) {
      let friendFormatted = {
        ...user,
        user_id: user._id,
        contact_type: 3,
      };
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

  return (
    <View style={styles.friendContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: user.avatar}} style={styles.avatar} />
        <View>
          <Text style={styles.friendName}>{user.full_name}</Text>
          <Text style={styles.friendPhone}>{user.phone}</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#666',
            }}>
            Tên danh bạ: {user.contact_name}
          </Text>
        </View>
      </View>
      {buttonTitle ? (
        <TouchableOpacity style={styles.addButton} onPress={onPressButton}>
          <Text style={styles.addButtonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  friendContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendName: {
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
  },
  friendPhone: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    margin: 15,
  },
  addButton: {
    backgroundColor: '#c0ffd2',
    borderRadius: 25,
    padding: 10,
  },
  addButtonText: {
    color: '#1dc071',
    textTransform: 'uppercase',
  },
});
export default FriendBox;
