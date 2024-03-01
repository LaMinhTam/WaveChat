import {onAuthStateChanged} from 'firebase/auth';
import React from 'react';
import {auth} from '../utils/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

export function UserDataProvider(props) {
  const [values, setValues] = React.useState({
    name: '',
    phone: '',
    password: '',
  });

  const [userInfo, setUserInfo] = React.useState('');
  const [confirmationResult, setConfirmationResult] = React.useState(null);
  const [accessTokens, setAccessTokens] = React.useState({});
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUserInfo(user);
    });
  }, []);

  const storeAccessToken = async (userId, token) => {
    try {
      // Save the access token to AsyncStorage
      await AsyncStorage.setItem(`accessToken_${userId}`, token);

      // Update the accessTokens state
      setAccessTokens(prevTokens => ({...prevTokens, [userId]: token}));
    } catch (error) {
      console.error('Error storing access token:', error);
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
