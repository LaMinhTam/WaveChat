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

const QRScanner = () => {
  const [scan, setScan] = useState('Scan your QR code!');
  const {accessTokens} = useUserData();

  useEffect(() => {
    const fetchJoinByScanLink = async ({link}) => {
      try {
        const response = await joinByScanLink(link, accessTokens);
        console.log(response);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchJoinByScanLink();
  }, []);

  return (
    <QRCodeScanner
      onRead={({data}) => {
        joinByScanLink(data, accessTokens);
      }}
      reactivate={true}
      reactivateTimeout={500}
      showMarker={true}
      topContent={
        <Text style={styles.centerText}>
          <Text style={styles.textBold}>{scan}</Text>
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
