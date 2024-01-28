import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {auth} from '../utils/firebaseConfig';
import {configureStore} from '@reduxjs/toolkit';
import {useAuth} from '../contexts/auth-context';
import {doc, serverTimestamp, setDoc} from 'firebase/firestore';
import BcryptReactNative from 'react-native-bcrypt';

const OTPScreen = ({navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const timerIntervalRef = useRef(null);
  const {confirmationResult, values, userInfo} = useAuth();

  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setResendTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, []);

  const handleInputChange = async (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (index < otp.length - 1 && value !== '') {
      refs[index + 1].focus();
    }

    console.log(values);

    setOtp(newOtp);

    if (newOtp.every(digit => digit !== '')) {
      try {
        let otpString = newOtp.join('');
        await confirmationResult.confirm(otpString);
        const hashedPassword = await bcrypt.hash(values.password, 10);

        // await setDoc(doc(db, 'users', auth.currentUser.uid), {
        //   id: auth.currentUser.uid,
        //   name: values.name,
        //   phone: values.phone,
        //   password: hashedPassword,
        //   avatar: 'https://source.unsplash.com/random',
        //   createdAt: serverTimestamp(),
        // });
        // navigation.navigate('Đăng nhập');
        console.log('done', hashedPassword);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const refs = Array(otp.length)
    .fill(0)
    .map(() => null);

  const handleResend = () => {
    clearInterval(timerIntervalRef.current);

    Alert.alert('Resend OTP', `OTP resent to your phone number.`);
    setIsResendDisabled(true);

    setResendTimer(60); // Reset the timer to 60 seconds

    timerIntervalRef.current = setInterval(() => {
      setResendTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    setTimeout(() => {
      setIsResendDisabled(false);
    }, 1000 * 60);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.description}>
        Mã xác nhận đã được gửi đến số điện thoại của bạn.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={value => handleInputChange(index, value)}
            keyboardType="numeric"
            maxLength={1}
            ref={input => (refs[index] = input)}
            color="#000"
          />
        ))}
      </View>

      <View style={styles.resendTimerContainer}>
        <Text style={styles.resendTimerText}>
          Thời gian còn lại {resendTimer}s
        </Text>
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Chưa nhận được OTP ? </Text>
        <TouchableOpacity
          style={[
            styles.resendButton,
            isResendDisabled && styles.disabledResendButton,
          ]}
          onPress={handleResend}
          disabled={isResendDisabled}>
          <Text style={styles.resendButtonText}>Gửi lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#1DC071',
    borderRadius: 8,
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: 'center',
    width: 40,
    height: 40,
  },
  resendTimerContainer: {
    marginTop: 10,
  },
  resendTimerText: {
    textAlign: 'center',
    color: '#000',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resendText: {
    textAlign: 'center',
    color: '#000',
  },
  resendButton: {
    marginLeft: 5,
  },
  disabledResendButton: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#1DC071',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default OTPScreen;
