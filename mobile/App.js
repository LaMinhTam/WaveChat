import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {UserDataProvider} from './contexts/auth-context';
import {useUserData} from './contexts/auth-context';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SocketProvider} from './contexts/SocketProvider';
import {PermissionsAndroid} from 'react-native';
const App = () => {
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);

  return (
    <Provider store={store}>
      <UserDataProvider>
        <NavigationContainer>
          <Main></Main>
        </NavigationContainer>
      </UserDataProvider>
    </Provider>
  );
};

const Main = () => {
  const {accessTokens} = useUserData();
  return (
    <>
      {accessTokens ? (
        <SocketProvider>
          <TabNavigator />
        </SocketProvider>
      ) : (
        <LoginStackNavigator />
      )}
    </>
  );
};
export default App;
