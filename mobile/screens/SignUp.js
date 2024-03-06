import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {useUserData} from '../contexts/auth-context';
import {Login, authSignUp} from '../apis/authenApi';
import {addUserToFireStore} from '../utils/firestoreManage';
// import auth from '@react-native-firebase/auth';

const SignUp = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('+84886700046');
  const [username, setUsername] = useState('La Minh Tâm');
  const [password, setPassword] = useState('123456789');
  const {setConfirmationResult, setValues, setUserInfo} = useUserData();

  const handleSignUp = async () => {
    try {
      // confirm = await auth().signInWithPhoneNumber(phoneNumber);
      // setConfirmationResult(confirm);
      values = {name: username, phone: phoneNumber, password: password};
      setValues(values);
      createUser(values);
      // navigation.navigate('OTPScreen');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  createUser = async values => {
    var {name, phone, password} = values;
    const formattedPhoneNumber = '0' + phone.slice(3);
    const data = await authSignUp(name, formattedPhoneNumber, password);

    if (data.status == 200) {
      try {
        const user = data.data;
        setUserInfo(user);

        addUserToFireStore(user);

        const logUser = await Login(user.phone, password);

        navigation.navigate('GenderDOBSelectionScreen', {
          accessToken: logUser.data.access_token,
        });
      } catch (error) {
        console.error(error);
      }
    } else if (data.status == 400) {
      Alert.alert('Lỗi', data.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View id="recaptcha-container"></View>
      <Text style={styles.label}>Số điện thoại</Text>
      <PhoneInput
        onChangePhoneNumber={number => {
          setPhoneNumber(number);
        }}
        initialCountry="vn"
        style={styles.phoneInput}
        textProps={{
          color: '#000',
          value: phoneNumber,
        }}
      />

      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Gồm 2-40 ký tự"
        onChangeText={text => setUsername(text)}
        placeholderTextColor={'#ccc'}
        color={'#000'}
        value={username}
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <PasswordField
        placeholder="Mật khẩu"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#1DC071',
  },
  phoneInput: {
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    padding: 10,
    marginBottom: 20,
  },
  confirmButton: {
    borderRadius: 10,
    backgroundColor: '#1DC071',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignUp;
