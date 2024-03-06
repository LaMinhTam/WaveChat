import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {Login} from '../apis/authenApi';
import {useUserData} from '../contexts/auth-context';
import {getProfile} from '../apis/user';
import {getFriends} from '../apis/friend';
import {addNewFCMToken} from '../utils/firestoreManage';

const SignIn = () => {
  const [phone, setPhone] = useState('+84886700046');
  const [password, setPassword] = useState('123456789');
  const [errorMessage, setErrorMessage] = useState('');
  const {setUserInfo, setFriends, storeAccessToken} = useUserData();

  const handleSignIn = async () => {
    const formattedPhoneNumber = '0' + phone.slice(3);
    const data = await Login(formattedPhoneNumber, password);
    if (data.status === 200) {
      user = data.data;
      profile = await getProfile(user._id, user.access_token);
      user = {...user, ...profile.data};
      setUserInfo(user);
      fetchFriends(data.data.access_token);
      storeAccessToken('accessToken', data.data.access_token);
      addNewFCMToken(user);
    } else if (data.status === 401) {
      setErrorMessage('Sai tài khoản hoặc mật khẩu');
    }
  };

  const fetchFriends = async access_token => {
    try {
      const friendsData = await getFriends(0, access_token);
      setFriends(friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
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
