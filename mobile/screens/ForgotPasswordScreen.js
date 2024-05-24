import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import OTPModal from '../components/OTPModal';

export default function ForgotPasswordScreen({navigation}) {
  const [phone, setPhone] = useState('0886700046');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const sendOtp = async () => {
    const formatPhone = '+84' + phone.slice(1);
    const signInConfirm = await auth().verifyPhoneNumber(formatPhone);
    setConfirm(signInConfirm);
    console.log(signInConfirm);
  };

  const handleOpenOTPModal = async () => {
    setOtpModalVisible(true);
    await sendOtp();
  };

  const handleConfirmOTP = async otp => {
    // if (confirm.code === otp) {
    navigation.navigate('ResetPassword', {phoneNumber: phone});
    //   handleSignUp();
    // } else {
    //   Alert.alert('Lỗi', 'Mã OTP không đúng');
    // }
  };

  const handleResendOTP = async () => {
    await sendOtp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        onChangeText={number => {
          setPhone(number);
        }}
        value={phone}
        style={styles.phoneInput}
        color={'#000'}
      />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleOpenOTPModal}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
    // padding: '10%',
  },
  phoneInput: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    color: '#000',
    padding: 10,
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    margin: 25,
    color: '#1DC071',
  },
  phoneInput: {
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    padding: 10,
    marginBottom: 20,
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
