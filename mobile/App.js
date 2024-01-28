import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {AuthProvider} from './contexts/auth-context';
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
