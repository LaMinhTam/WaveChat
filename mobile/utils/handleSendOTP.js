import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import {Firestore} from '@react-native-firebase/firestore';

export default async function handleSendOTP(phone, setConfirm) {
  try {
    confirmationResult = await auth().signInWithPhoneNumber(phone);
    setConfirm(confirmationResult);
  } catch (error) {
    console.log(error);
  }
  return confirmationResult;
}
