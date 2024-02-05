import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {Login} from '../apis/authenApi';
import {useAuth} from '../contexts/auth-context';
import {useDispatch} from 'react-redux';
import {setSocket} from '../store/chatSlice';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';

const SignIn = () => {
  const [phone, setPhone] = useState('+84886700046');
  const [password, setPassword] = useState('123456789');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const {setUserInfo, storeAccessToken} = useAuth();
  const {accessTokens} = useAuth();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    const formattedPhoneNumber = '0' + phone.slice(3);
    const data = await Login(formattedPhoneNumber, password);

    if (data.status === 200) {
      const user = data.data;
      const newSocket = io(`ws://${HOST_IP}:3000`, {
        extraHeaders: {
          Authorization: user.access_token,
        },
        query: {device: user._id},
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      newSocket.on('disconnect', reason => {
        console.log('Disconnected from WebSocket. Reason:', reason);
      });

      newSocket.on('message-text', incomingMessage => {
        setMessages(prevMessages => [incomingMessage.message, ...prevMessages]);
      });

      dispatch(setSocket(newSocket));
      setErrorMessage('');
      setUserInfo(user);
      storeAccessToken('accessToken', user.access_token);
    } else if (data.status === 401) {
      setErrorMessage('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      <PhoneInput
        onChangePhoneNumber={setPhone}
        initialCountry="vn"
        style={styles.phoneInput}
        textProps={{
          color: '#000',
          value: phone,
        }}
      />

      <PasswordField
        placeholder="Mật khẩu"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={() => handleSignIn()}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      {errorMessage !== '' && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  phoneInput: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    padding: 10,
    width: '90%',
  },
  button: {
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    backgroundColor: '#1DC071',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignIn;
