import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {AuthProvider} from './contexts/auth-context';
import {useAuth} from './contexts/auth-context';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Main></Main>
      </AuthProvider>
    </Provider>
  );
};

const Main = () => {
  const {accessTokens} = useAuth();
  return (
    <>{accessTokens.accessToken ? <HomeScreen /> : <LoginStackNavigator />}</>
  );
};
export default App;
