import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {AuthProvider} from './contexts/auth-context';
import {useAuth} from './contexts/auth-context';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SocketProvider} from './contexts/SocketProvider';
const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <Main></Main>
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
};

const Main = () => {
  const {accessTokens} = useAuth();
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
