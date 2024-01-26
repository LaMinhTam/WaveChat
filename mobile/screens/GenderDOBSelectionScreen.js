import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';

const GenderDOBSelectionScreen = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedDOB, setSelectedDOB] = useState(new Date());

  const handleGenderSelection = gender => {
    setSelectedGender(gender);
  };

  const handleDateChange = date => {
    setSelectedDOB(date);
  };

  const navigateToNextScreen = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn giới tính</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'male' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelection('male')}>
          <Text style={styles.genderButtonText}>Nam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'female' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelection('female')}>
          <Text style={styles.genderButtonText}>Nữ</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Chọn ngày sinh</Text>

      <DatePicker
        date={selectedDOB}
        onDateChange={handleDateChange}
        androidVariant="nativeAndroid"
        mode="date"
        locale="vi"
      />
      <Text style={styles.selectedDOBText}>
        Ngày sinh: {selectedDOB.toLocaleDateString('en-US')}
      </Text>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={navigateToNextScreen}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1DC071',
  },
  selectedGender: {
    backgroundColor: '#1DC071',
    color: '#fff',
  },
  genderButtonText: {
    color: '#1DC071',
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: '#1DC071',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  selectedDOBText: {
    marginVertical: 10,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#1DC071',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GenderDOBSelectionScreen;
