import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {AuthProvider} from './contexts/auth-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, View } from 'react-native';
const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LoginStackNavigator />
      </AuthProvider>
    </Provider>
  );
};

export default App;
