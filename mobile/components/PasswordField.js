import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

const PasswordField = ({placeholder, onChangeText, value}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.passwordInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        onChangeText={onChangeText}
        placeholderTextColor={'#ccc'}
        color={'#000'}
        value={value}
      />

      <TouchableOpacity onPress={toggleShowPassword}>
        <Text style={styles.showPasswordButton}>
          {showPassword ? 'Ẩn' : 'Hiện'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#1DC071',
    marginBottom: 20,
    width: '100%',
  },
  textInput: {
    flex: 1,
  },
  showPasswordButton: {
    color: '#1DC071',
    marginLeft: 10,
  },
});

export default PasswordField;
