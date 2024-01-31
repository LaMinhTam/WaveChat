import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MAIN_COLOR, commonStyle} from '../styles';
import {getFriends} from '../apis/user';
import {useAuth} from '../contexts/auth-context';

const Separator = () => <View style={styles.separator} />;

const FriendScreen = () => {
  const {accessTokens} = useAuth();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const friendsData = await getFriends(accessTokens.accessToken);
      setData(friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const renderFriendsByCharacter = () => {
    const friendsByCharacter = {};

    data.forEach(item => {
      const firstChar = item.full_name[0].toUpperCase();

      if (!friendsByCharacter[firstChar]) {
        friendsByCharacter[firstChar] = [];
      }

      friendsByCharacter[firstChar].push(item);
    });

    return Object.keys(friendsByCharacter).map(char => (
      <View key={char}>
        <Text style={styles.sectionTitle}>{char}</Text>
        {friendsByCharacter[char].map(friend => (
          <View key={friend.user_id} style={styles.friendRow}>
            <Image source={{uri: friend.avatar}} style={styles.avatar} />
            <Text style={{color: '#000', fontSize: 16}}>
              {friend.full_name}
            </Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.button}>
          <View
            style={[styles.buttonIconContainer, {backgroundColor: MAIN_COLOR}]}>
            <Icon name="user-plus" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Lời mời kết bạn</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity style={styles.button}>
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
