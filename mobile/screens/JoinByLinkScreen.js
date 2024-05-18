import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useSocket} from '../contexts/SocketProvider';
import Clipboard from '@react-native-clipboard/clipboard';
import FeatherIcon from 'react-native-vector-icons/Feather';

const JoinByLinkScreen = () => {
  const {currentConversation} = useSocket();

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#fff'}}>
      <View
        style={{
          marginTop: 50,
          width: '100%',
          height: '300',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <QRCode value={currentConversation.link_join} color="#000" size={250} />
        <View style={{marginTop: 50}}>
          <Text style={{color: '#000'}}>
            Bất kỳ ai có link này đề có thể tham gia nhóm.
          </Text>
          <Text style={{color: '#000'}}>
            Chỉ chia sẻ với những người mà bạn tin tưởng.
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#6161ff',
            padding: 10,
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() =>
            Clipboard.setString(
              `https://wavechat.me/g/conversation/${currentConversation._id}?link_join=${currentConversation.link_join}`,
            )
          }>
          <Text style={{color: '#fff'}}>{currentConversation.link_join}</Text>
          <FeatherIcon name="copy" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinByLinkScreen;
