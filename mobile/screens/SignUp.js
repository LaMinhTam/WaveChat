import React, {useEffect, useState} from 'react';
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
import {useUserData} from '../contexts/auth-context';
import {Login, authSignUp} from '../apis/authenApi';
import {addUserToFireStore} from '../utils/firestoreManage';
import auth from '@react-native-firebase/auth';
import OTPModal from '../components/OTPModal';

const SignUp = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('0986148209');
  const [username, setUsername] = useState('Trần Trung Tiến');
  const [password, setPassword] = useState('123456789');
  const [confirm, setConfirm] = useState(null);
  const {setValues, setUserInfo} = useUserData();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  // const handleInputOTP = async code => {
  //   const credential = await auth.PhoneAuthProvider.credential(
  //     confirm.verificationId,
  //     code,
  //   );

  //   const result = await auth().signInWithCredential(credential);
  //   console.log(result);
  // };

  const handleSignUp = async () => {
    try {
      values = {name: username, phone: phoneNumber, password: password};
      setValues(values);
      createUser(values);
      // navigation.navigate('OTPScreen');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const createUser = async values => {
    var {name, phone, password} = values;
    const data = await authSignUp(name, phone, password);

    if (data.status == 200) {
      try {
        let user = data.data;
        user = {
          ...user,
          avatar:
            'https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg',
          cover: 'https://source.unsplash.com/random',
        };
        console.log(user);
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

  const sendOtp = async () => {
    const formatPhone = '+84' + phoneNumber.slice(1);
    const signInConfirm = await auth().verifyPhoneNumber(formatPhone);
    setConfirm(signInConfirm);
    console.log(signInConfirm);
  };

  const handleOpenOTPModal = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Lỗi',
        'Mật khẩu mới không đáp ứng yêu cầu. Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt.',
      );
    } else {
      setOtpModalVisible(true);
      await sendOtp();
    }
  };

  const handleConfirmOTP = async otp => {
    if (confirm.code === otp) {
      handleSignUp();
    } else {
      Alert.alert('Lỗi', 'Mã OTP không đúng');
    }
  };

  const handleResendOTP = async () => {
    await sendOtp();
  };
  return (
    <View style={styles.container}>
      <View id="recaptcha-container"></View>
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        onChangeText={number => {
          setPhoneNumber(number);
        }}
        value={phoneNumber}
        style={styles.phoneInput}
        color={'#000'}
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

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleOpenOTPModal}
        // onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <OTPModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        onResend={handleResendOTP}
        onConfirm={handleConfirmOTP}
      />
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
