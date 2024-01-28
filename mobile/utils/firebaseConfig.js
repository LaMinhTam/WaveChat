// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyD1peLxalqAVZXfpNWI6qrur1NNMn7WxHY',
  authDomain: 'wave-chat-56d7c.firebaseapp.com',
  projectId: 'wave-chat-56d7c',
  storageBucket: 'wave-chat-56d7c.appspot.com',
  messagingSenderId: '196838161202',
  appId: '1:196838161202:web:c262c3c3e54b88c920752b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
