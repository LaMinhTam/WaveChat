import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import {auth} from './firebaseConfig';

export default async function handleSendOTP(phone) {
  let verify = new RecaptchaVerifier(
    'recaptcha-container',
    {
      size: 'invisible',
    },
    auth,
  );

  const confirmationResult = await signInWithPhoneNumber(auth, phone, verify);
  return confirmationResult;
}
