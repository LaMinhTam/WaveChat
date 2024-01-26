import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const AuthenScreen = ({navigation}) => {
  const navigateToSignIn = () => {
    navigation.navigate('Đăng nhập');
  };
  const navigateToSignUp = () => {
    navigation.navigate('Tạo tài khoản');
  };

  return (
    <ImageBackground
      source={require('../assets/img/background.png')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.appName}>WaveChat</Text>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/WaveChat-icon.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.welcomeText}>Welcome to WaveChat</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToSignIn}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#5E5E5E'}]}
          onPress={navigateToSignUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 300,
    marginRight: 15,
  },
  appName: {
    color: '#1DC071',
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#1DC071',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AuthenScreen;
