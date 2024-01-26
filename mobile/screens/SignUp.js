import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import PasswordField from '../components/PasswordField';
import {auth} from '../utils/firebaseConfig';
import {useAuth} from '../contexts/auth-context';
import handleSendOTP from '../utils/handleSendOTP';

const SignUp = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setConfirmationResult, setValues, userInfo} = useAuth();

  const handleSignUp = async () => {
    console.log(
      'Signing up with Phone:',
      phoneNumber,
      'Username:',
      username,
      'Password:',
      password,
    );
    try {
      await handleSendOTP(phoneNumber);
      // console.log('this', confirmationResult.verificationId);
      // setValues({name: username, phone: phoneNumber, password: password});
      // setConfirmationResult(confirmationResult);
      // navigation.navigate('OTPScreen');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View id="recaptcha-container"></View>
      <Text style={styles.label}>Số điện thoại</Text>
      <PhoneInput
        onChangePhoneNumber={number => setPhoneNumber(number)}
        initialCountry="vn"
        style={styles.phoneInput}
      />

      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Gồm 2-40 ký tự"
        onChangeText={text => setUsername(text)}
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <PasswordField placeholder="Mật khẩu" onChangeText={setPassword} />

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
