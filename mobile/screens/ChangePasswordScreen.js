import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import PasswordField from '../components/PasswordField';
import {MAIN_COLOR} from '../styles/styles';
import {changePassword} from '../apis/user';
import {useUserData} from '../contexts/auth-context';

const ChangePasswordScreen = ({navigation}) => {
  const {accessTokens} = useUserData();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và mật khẩu xác nhận không khớp');
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Lỗi',
        'Mật khẩu mới không đáp ứng yêu cầu. Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt.',
      );
      return;
    }

    const data = await changePassword(
      currentPassword,
      newPassword,
      accessTokens,
    );

    if (data.status === 401) {
      Alert.alert('Lỗi', 'Mật khẩu hiện tại không chính xác');
    } else if (data.status === 400) {
      Alert.alert('Lỗi', data.message);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={{margin: 20}}>
      <Text style={{marginBottom: 10}}>Mật khẩu hiện tại</Text>
      <PasswordField
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <Text style={{marginBottom: 10}}>Mật khẩu mới</Text>
      <PasswordField value={newPassword} onChangeText={setNewPassword} />
      <Text style={{marginBottom: 10}}>Xác nhận mật khẩu mới</Text>
      <PasswordField
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        onPress={handleUpdatePassword}
        style={{
          backgroundColor: MAIN_COLOR,
          padding: 15,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{fontSize: 16, color: '#fff', fontWeight: '700'}}>
          CẬP NHẬT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;
