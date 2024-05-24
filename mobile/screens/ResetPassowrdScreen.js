import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

const ResetPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleResetPassword = () => {
    console.log('Reset password initiated for phone number:', phoneNumber);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        disabled={!phoneNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default ResetPasswordScreen;
