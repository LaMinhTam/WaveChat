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


const JoinByLinkScreen = ({navigation}) => {
  const {currentConversation} = useSocket();
  const [link, setLink] = useState('NAN');
  useEffect(() => {
    if (currentConversation.link_join != '') {
      setLink(currentConversation.link_join);
    } 
  }, []);
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
        <QRCode value={link} color="#000" backgroundColor="#ccc" size={250} />
        <View style={{marginTop: 50}}>
          <Text style={{color: '#000'}}>Bất kỳ ai có link này đề có thể tham gia nhóm.</Text>
          <Text style={{color: '#000'}} >Chỉ chia sẻ với những người mà bạn tin tưởng.</Text>
        </View>
      </View>
    </View>
  );
};

export default JoinByLinkScreen;
