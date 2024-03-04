import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getConversations} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {formatTimeLastActivity} from '../utils/format-time-message.util';

const HomeScreen = ({navigation}) => {
  const {conversations, setConversations, setCurrentConversation} = useSocket();
  const {accessTokens, userInfo} = useUserData();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversation = await getConversations(accessTokens.accessToken);
        setConversations(conversation.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {conversations.map(conversation => (
        <TouchableOpacity
          key={conversation._id}
          style={styles.conversationRow}
          onPress={() => {
            setCurrentConversation(conversation);
            navigation.navigate('ChatScreen');
          }}>
          <Image
            style={styles.avatar}
            source={{
              uri: conversation.avatar || 'https://source.unsplash.com/random',
            }}
          />

          <View style={styles.infoColumn}>
            <View>
              <Text style={styles.name}>{conversation.name}</Text>
              <Text style={styles.lastMessage}>
                {(conversation.last_message.user._id === userInfo._id
                  ? 'Bạn'
                  : conversation.last_message.user.full_name) +
                  ': ' +
                  conversation.last_message.message}
              </Text>
            </View>
            <Text style={styles.lastActivity}>
              {formatTimeLastActivity(conversation.last_activity)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 13},
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 12,
  },
  infoColumn: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT_COLOR,
  },
  lastActivity: {
    color: '#73787C',
    fontSize: 12,
    marginLeft: 'auto',
  },
  lastMessage: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default HomeScreen;
