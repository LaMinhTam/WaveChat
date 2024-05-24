import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import PasswordField from '../components/PasswordField';
import {resetPassowrd} from '../apis/authenApi';

const ResetPasswordScreen = ({navigation, route}) => {
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleResetPassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    } else if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Mật khẩu mới không đáp ứng yêu cầu. Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt.',
      );
    } else {
      setErrorMessage('');
      console.log('Reset password initiated for phone number:', phoneNumber);
      fetchResetPassword(phoneNumber, password);
    }
  };

  const fetchResetPassword = async (phoneNumber, password) => {
    const res = await resetPassowrd(phoneNumber, password);
    console.log(res);
    if (res.status === 200) {
      navigation.navigate('SignIn');
    } else {
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <PasswordField
        placeholder="Mật khẩu mới"
        onChangeText={setPassword}
        value={password}
      />
      <PasswordField
        placeholder="Nhập lại mật khẩu mới"
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <TouchableOpacity onPress={() => handleResetPassword()}>
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
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#1DC071',
    padding: 15,
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default ResetPasswordScreen;
