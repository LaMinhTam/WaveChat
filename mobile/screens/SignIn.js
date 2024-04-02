import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {Login} from '../apis/authenApi';
import {useUserData} from '../contexts/auth-context';
import {getProfile, resetPassword} from '../apis/user';
import {getFriends} from '../apis/friend';
import {addNewFCMToken} from '../utils/firestoreManage';
import {TextInput} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const SignIn = () => {
  const [phone, setPhone] = useState('0886700046');
  const [password, setPassword] = useState('Tam123456789@');
  const [errorMessage, setErrorMessage] = useState('');
  const {handleSignIn, setFriends} = useUserData();

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setPhone}
        value={phone}
        style={styles.phoneInput}
      />
      <PasswordField
        style={{width: '90%'}}
        placeholder="Mật khẩu"
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSignIn(phone, password)}>
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
    padding: '10%',
  },
  phoneInput: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    color: '#000',
    padding: 10,
    width: '100%',
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
