// import {onAuthStateChanged} from 'firebase/auth';
import React from 'react';
// import {auth} from '../utils/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFriends} from '../apis/friend';
import {getProfile} from '../apis/user';
import {Login} from '../apis/authenApi';

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
      user = data.data;
      setAccessTokens(accessToken);
      profile = await getProfile(user._id, accessToken);
      user = {...user, ...profile.data};
      setUserInfo(user);
      fetchFriends();
      setUserInfo(user);
    }
  };

  const fetchFriends = async () => {
    try {
      const friendsData = await getFriends(0, accessTokens);
      setFriends(friendsData.data);
      console.log('friends', friendsData.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const storeAccessToken = async (token, values) => {
    try {
      setAccessTokens(token);
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('phone', values.phone);
      await AsyncStorage.setItem('password', values.password);
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
