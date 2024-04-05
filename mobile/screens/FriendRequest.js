import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useUserData} from '../contexts/auth-context';
import {
  BACKGROUND_COLOR,
  PRIMARY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
  SECOND_COLOR,
} from '../styles/styles';
import {
  acceptFriendRequest,
  getFriends,
  removeFriend,
  revokeFriendRequest,
} from '../apis/friend';
import {createConversation} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';

const ReceiveFriendRequest = ({navigation}) => {
  const {accessTokens, friends, setFriends} = useUserData();
  const [friendsData, setFriendsData] = useState([]);
  const {setConversations} = useSocket();

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Đã nhận ${friendsData.length}`,
    });
  }, [friendsData]);

  const fetchFriends = async () => {
    try {
      const friendsData = await getFriends(2, accessTokens);
      setFriendsData(friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const renderFriendRequest = friend => {
    return (
      <View style={styles.friendRow} key={friend.user_id}>
        <View style={styles.avatarColumn}>
          <Image source={{uri: friend.avatar}} style={styles.avatar} />
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.fullName}>{friend.full_name}</Text>
        </View>
        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleAccept(friend)}>
            <Text style={[styles.buttonText, styles.approveText]}>ĐỒNG Ý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleReject(friend)}>
            <Text style={styles.buttonText}>TỪ CHỐI</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleReject = async friend => {
    // Implement reject logic
    const data = await removeFriend(friend.user_id, accessTokens);
    if (data.status === 200) {
      setFriendsData(
        friendsData.filter(
          currentFriend => currentFriend.user_id !== friend.user_id,
        ),
      );
    }
  };

  const handleAccept = async friend => {
    const data = await acceptFriendRequest(friend.user_id, accessTokens);
    if (data.status === 200) {
      const updatedFriendsData = friendsData.filter(
        currentFriend => currentFriend.user_id !== friend.user_id,
      );

      await createConversation(friend.user_id, accessTokens);

      const updatedFriend = {...friend, type: 4};
      setFriendsData(updatedFriendsData);
      setFriends(prevFriends => [...prevFriends, updatedFriend]);
    }
  };
  console.log(friends);
  return (
    <View style={styles.container}>
      {friendsData.length > 0 ? (
        friendsData.map(renderFriendRequest)
      ) : (
        <Text style={styles.noRequestsText}>Chưa gửi lời mời kết bạn nào.</Text>
      )}
    </View>
  );
};

const SendFriendRequest = ({navigation}) => {
  const {accessTokens} = useUserData();
  const [friendsData, setFriendsData] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Đã gửi ${friendsData.length}`,
    });
  }, [friendsData]);

  const fetchFriends = async () => {
    try {
      const friendsData = await getFriends(3, accessTokens);
      setFriendsData(friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const renderFriendRequest = friend => {
    return (
      <View style={styles.friendRow} key={friend.user_id}>
        <View style={styles.avatarColumn}>
          <Image source={{uri: friend.avatar}} style={styles.avatar} />
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.fullName}>{friend.full_name}</Text>
          <Text style={styles.secondaryText}>Muốn kết bạn</Text>
        </View>
        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRevoke(friend)}>
            <Text style={styles.buttonText}>THU HỒI</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleRevoke = async friend => {
    const data = await revokeFriendRequest(friend.user_id, accessTokens);
    if (data.status === 200) {
      setFriendsData(
        friendsData.filter(
          currentFriend => currentFriend.user_id !== friend.user_id,
        ),
      );
    }
  };

  return (
    <View style={styles.container}>
      {friendsData.length > 0 ? (
        friendsData.map(renderFriendRequest)
      ) : (
        <Text style={styles.noRequestsText}>
          Chưa nhận lời mời kết bạn nào.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECOND_COLOR,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  avatarColumn: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoColumn: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_TEXT_COLOR,
  },
  secondaryText: {
    color: SECONDARY_TEXT_COLOR,
  },
  buttonsColumn: {
    gap: 10,
  },
  button: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 5,
  },
  buttonText: {
    color: PRIMARY_TEXT_COLOR,
    fontWeight: '500',
  },
  approveButton: {
    backgroundColor: '#f0faf5',
  },
  approveText: {
    color: '#13f287',
  },
  noRequestsText: {
    color: PRIMARY_TEXT_COLOR,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export {SendFriendRequest};
export {ReceiveFriendRequest};
