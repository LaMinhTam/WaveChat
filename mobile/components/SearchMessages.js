import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';

const SearchMessages = ({
  searchKeyword,
  setSearchKeyword,
  handlePrevResult,
  handleNextResult,
  currentIndex,
  searchResults,
  turnOffSearch,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'white',
      }}>
      <TextInput
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        placeholder="Search messages..."
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 5,
          color: PRIMARY_TEXT_COLOR,
        }}
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={handlePrevResult}>
          <FeatherIcon
            name="chevron-down"
            size={24}
            color={PRIMARY_TEXT_COLOR}
          />
        </TouchableOpacity>

        {searchResults.length > 0 && (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{color: PRIMARY_TEXT_COLOR}}>
              {currentIndex + 1}/{searchResults.length}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={handleNextResult}>
          <FeatherIcon name="chevron-up" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={turnOffSearch}>
        <FeatherIcon name="x-circle" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchMessages;
