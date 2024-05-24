import React, {Component, useContext, useEffect} from 'react';
import {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {getConversations, joinByScanLink} from '../apis/conversation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useUserData} from '../contexts/auth-context';
import {useSocket} from '../contexts/SocketProvider';

const QRScanner = () => {
  const {setConversations} = useSocket();
  const joinByLink = async link => {
    const data = await joinByScanLink(link);
    Alert.alert('Thông báo', data.message);
    console.log(data);
    const conversation = await getConversations();
    setConversations(conversation.data);
  };
  return (
    <QRCodeScanner
      onRead={({data}) => {
        joinByLink(data);
      }}
      reactivate={true}
      reactivateTimeout={500}
      showMarker={true}
      topContent={
        <Text style={styles.centerText}>
          <Text style={styles.textBold}>Scan your QR code!</Text>
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

AppRegistry.registerComponent('default', () => QRScanner);
export default QRScanner;
