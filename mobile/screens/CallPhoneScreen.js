'use strict';

import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CONVERSATION_TYPE} from '../apis/constants';
import AvatarUser from '../components/AvatarUser';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {useNavigation} from '@react-navigation/native';

// {
//   "signal_data": {},
//   "user_from": {
//       "_id": "65bb1f8e1ab76732804a5bc0",
//       "avatar": "",
//       "full_name": "loc2",
//   },
//   "user_to": {
//       "_id": "65bb1f9a1ab76732804a5bc4",
//       "avatar": "",
//       "full_name": "loc001-ok"
//   }
// }

const CallPhoneScreen = ({navigate}) => {
  const {accessTokens, userInfo} = useUserData();
  const {socket} = useSocket();
  const navigation = useNavigation();

  const route = useRoute();

  // type: string (call_to: gọi cho người ta, call_from: người ta gọi cho mình)
  const {data, type} = route.params;
  console.log('CallPhoneScreen ~ data:', data?.user_from?.full_name);

  // const [isCalling, setIsCalling] = useState(true);

  const handleAnswerCall = () => {
    // Xử lý khi trả lời cuộc gọi

    socket.emit('answer-call-video', {
      target_user_id: data.user_from?._id,
      signal_data: data?.signal_data || {},
      message: 'answer call video',
    });

    // setIsCalling(false);
  };

  const handleDeclineCall = () => {
    // Xử lý khi từ chối cuộc gọi

    socket.emit('deny-call-video', {
      target_user_id: data.user_from?._id,
      signal_data: data?.signal_data || {},
      message: 'deny call video',
    });

    navigation.goBack();

    // setIsCalling(false);
  };

  //create a phone screen when user receive a call

  const textLabelCalling =
    type === 'call_to' ? 'đang gọi cho bạn...' : 'chờ phản hồi...';
  const conversationName = data?.user_from?.full_name || data?.name;

  return (
    <View style={styles.container}>
      {/* tên người gọi và đang gọi */}
      <View style={styles.textContainer}>
        <Text style={styles.textNameUser}>{conversationName}</Text>
        <Text style={styles.textLabelCalling}>{textLabelCalling}</Text>
      </View>

      {/* Avatar */}

      <View style={styles.avatarContainer}>
        {/* <Image style={styles.avatar} /> */}
        <AvatarUser
          avatarUrl={''}
          style={styles.avatar}
          type={CONVERSATION_TYPE.PERSONAL}
        />
      </View>

      {/* Nếu là người khác call thì có 2 nút trả lời từ chối, còn nếu gọi thì có kết thúc và bật loa to hơn */}

      {type === 'call_to' ? (
        <>
          <View style={styles.buttonContainer}>
            {/* Nút trả lời và từ chối */}

            <View style={styles.actionButton}>
              <TouchableOpacity
                onPress={handleAnswerCall}
                style={[styles.actionButton, styles.answerButton]}>
                {/* <Icon name="phone" size={30} color="white" /> */}

                <Icon name="phone" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Trả lời</Text>
            </View>

            <View style={styles.actionButton}>
              <TouchableOpacity
                onPress={handleDeclineCall}
                style={[styles.actionButton, styles.rejectButton]}>
                <Icon name="phone" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Từ chối</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <View style={styles.actionButton}>
              <TouchableOpacity
                style={[styles.actionButton, styles.soundButton]}>
                <Icon name="sound" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Bật loa</Text>
            </View>
            <View style={styles.actionButton}>
              <TouchableOpacity
                onPress={handleDeclineCall}
                style={[styles.actionButton, styles.rejectButton]}>
                <Icon name="phone" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Kết thúc</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6495ed',
  },
  textContainer: {
    position: 'absolute',
    top: 125,
    alignItems: 'center',
  },
  textNameUser: {
    fontSize: 27,
    fontWeight: 'bold',
    color: PRIMARY_TEXT_COLOR,
  },

  textLabelCalling: {
    fontSize: 25,
    // fontWeight: 'bold',
    color: PRIMARY_TEXT_COLOR,
  },
  avatarContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  avatar: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 40,
    bottom: 20,
    flex: 1,
  },
  actionButton: {
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },

  soundButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default CallPhoneScreen;
