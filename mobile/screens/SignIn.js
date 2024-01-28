import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {Login} from '../apis/login';
import {useAuth} from '../contexts/auth-context';
import {getProfile} from '../apis/profile';

const SignIn = () => {
  const [phone, setPhone] = useState('0000000003');
  const [password, setPassword] = useState('test1234');
  const {accessTokens, storeAccessToken} = useAuth();
  const handleSignIn = async () => {
    const data = await Login(phone, password);
    console.log(data.data);
    storeAccessToken('accessToken', data.data.access_token);
  };

  const getProfileTest = async () => {
    const data = await getProfile(
      '65b37e24583f74cac4d603eb',
      accessTokens.accessToken,
    );
    console.log('user profile ', data.data);
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
      <Button title="test" onPress={() => getProfileTest()}></Button>
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
});

export default SignIn;
