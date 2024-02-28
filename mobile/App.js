import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {UserDataProvider} from './contexts/auth-context';
import {useUserData} from './contexts/auth-context';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SocketProvider} from './contexts/SocketProvider';
const App = () => {
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
      {accessTokens.accessToken ? (
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
