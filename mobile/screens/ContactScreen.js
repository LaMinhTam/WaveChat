import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAIN_COLOR} from '../styles';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';

const Separator = () => <View style={styles.separator} />;

const FriendScreen = ({navigation}) => {
  const {userInfo, friends} = useUserData();
  const {setCurrentConversation, conversations} = useSocket();

  const handlePressFriend = friend => {
    const existingConversation = conversations.find(conversation => {
      if (conversation.type === 2) {
        return conversation.members.some(member => member === friend.user_id);
      }
    });

    const newConversation = {
      name: friend.full_name,
      avatar: friend.avatar,
      members: [
        {
          _id: userInfo._id,
          avatar: userInfo.avatar,
          full_name: userInfo.full_name,
        },
        {
          _id: friend.user_id,
          avatar: friend.avatar,
          full_name: friend.full_name,
        },
      ],
      type: 2,
    };
    setCurrentConversation(existingConversation || newConversation);
    navigation.navigate('ChatScreen');
  };

  const renderFriendsByCharacter = () => {
    const friendsByCharacter = {};
    const currentFriends = friends.filter(friend => friend.contact_type == 4);

    currentFriends.forEach(item => {
      const firstChar = item.full_name[0].toUpperCase();

      if (!friendsByCharacter[firstChar]) {
        friendsByCharacter[firstChar] = [];
      }

      friendsByCharacter[firstChar].push(item);
    });

    return Object.keys(friendsByCharacter)
      .sort()
      .map(char => (
        <View key={char}>
          <Text style={styles.sectionTitle}>{char}</Text>
          {friendsByCharacter[char].map(friend => (
            <TouchableOpacity
              key={friend.user_id}
              style={styles.friendRow}
              onPress={() => handlePressFriend(friend)}>
              <Image source={{uri: friend.avatar}} style={styles.avatar} />
              <Text style={{color: '#000', fontSize: 16}}>
                {friend.full_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('FriendRequest');
          }}>
          <View
            style={[styles.buttonIconContainer, {backgroundColor: MAIN_COLOR}]}>
            <Icon name="user-plus" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Lời mời kết bạn</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('PhoneContacts');
          }}>
          <View
            style={[styles.buttonIconContainer, {backgroundColor: MAIN_COLOR}]}>
            <Icon name="address-book" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Danh bạ máy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <View style={styles.section}>{renderFriendsByCharacter()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: PRIMARY_TEXT_COLOR,
  },
  line: {
    height: 4,
    backgroundColor: '#F3F4F6',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
    color: PRIMARY_TEXT_COLOR,
  },
  separator: {
    height: 4,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 20,
  },
});

export default FriendScreen;
