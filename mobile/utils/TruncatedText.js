import {View, Text, Linking, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {
  getConversationDetail,
  getConversations,
  getListMember,
  joinByScanLink,
} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';

export const TruncatedText = ({text}) => {
  const {setConversations, setCurrentConversation} = useSocket();
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length > 4);
  }, []);

  const joinByLink = async link => {
    //ask if user want to join group, with Alert.alert
    const data = await joinByScanLink(link.split('link_join=').pop());
    Alert.alert('Thông báo', data.message);
    const conversation = await getConversations();
    setConversations(conversation.data);
  };

  const handleText = text => {
    if (typeof text !== 'string') {
      return text;
    }

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const matchedUrls = text.match(urlPattern);

    if (matchedUrls) {
      return text.split(urlPattern).map((chunk, index) => {
        if (urlPattern.test(chunk)) {
          return (
            <TouchableOpacity key={index} onPress={() => joinByLink(chunk)}>
              <Text
                style={{
                  color: 'blue',
                  textDecorationLine: 'underline',
                }}>
                {chunk.length > 30 ? `${chunk.slice(0, 30)}...` : chunk}
              </Text>
            </TouchableOpacity>
          );
        }
        return chunk.length > 30 ? `${chunk.slice(0, 30)}...` : chunk;
      });
    }

    return text;
  };

  return (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 4}
        style={{lineHeight: 21, color: PRIMARY_TEXT_COLOR}}>
        {handleText(text[0])} {/* Pass the entire text string to handleText */}
      </Text>
      {lengthMore && (
        <TouchableOpacity onPress={toggleNumberOfLines}>
          <Text style={{color: 'blue', marginTop: 5}}>
            {textShown ? 'Rút gọn...' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
