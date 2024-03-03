import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getConversations} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {formatTimeLastActivity} from '../utils/format-time-message.util';

const HomeScreen = ({navigation}) => {
  const {conversations, setConversations, setCurrentConversation} = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversation = await getConversations(user.access_token);
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
            <Text style={styles.name}>{conversation.name}</Text>
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
  container: {},
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
});

export default HomeScreen;
