// import {onAuthStateChanged} from 'firebase/auth';
import React from 'react';
// import {auth} from '../utils/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFriends} from '../apis/friend';
import {getProfile} from '../apis/user';
import {Login} from '../apis/authenApi';
import {addNewFCMToken} from '../utils/firestoreManage';
import {Alert} from 'react-native';

const AuthContext = React.createContext();

export function UserDataProvider(props) {
  const [values, setValues] = React.useState({
    name: '',
    phone: '',
    password: '',
  });

  const [userInfo, setUserInfo] = React.useState('');
  const [confirmationResult, setConfirmationResult] = React.useState(null);
  const [accessTokens, setAccessTokens] = React.useState();
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    isLogining();
  }, []);

  const isLogining = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const phone = await AsyncStorage.getItem('phone');
    const password = await AsyncStorage.getItem('password');
    if (accessToken) {
      const data = await Login(phone, password);
      await handleLoginSuccess(data.data);
    }
  };

  const fetchFriends = async accessToken => {
    try {
      const friendsData = await getFriends(0, accessToken);
      setFriends(friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const storeAccessToken = async token => {
    try {
      setAccessTokens(token);
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Error storing access token:', error);
    }
  };

  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      setAccessTokens(null);
    } catch (error) {
      console.error('Error removing access token:', error);
    }
  };

  const handleLoginSuccess = async user => {
    profile = await getProfile(user._id, user.access_token);
    console.log(profile);
    user = {
      ...user,
      ...profile.data,
    };

    setUserInfo(user);
    fetchFriends(user.access_token);
    // addNewFCMToken(user);
    setAccessTokens(user.access_token);
    await AsyncStorage.setItem('accessToken', user.access_token);
  };

  const handleSignIn = async (phone, password) => {
    const data = await Login(phone, password);
    if (data.status === 200) {
      console.log(data.data.access_token);
      await handleLoginSuccess(data.data);
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('password', password);
    } else {
      Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu');
    }
  };

  const contextValues = {
    values,
    userInfo,
    setValues,
    setUserInfo,
    friends,
    setFriends,
    confirmationResult,
    setConfirmationResult,
    accessTokens,
    storeAccessToken,
    removeAccessToken,
    handleSignIn,
  };
  return (
    <AuthContext.Provider
      value={contextValues}
      {...props}></AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserData() {
  const context = React.useContext(AuthContext);
  if (typeof context === 'undefined')
    throw new Error('useUserData must be used within AuthProvider');
  return context;
}
