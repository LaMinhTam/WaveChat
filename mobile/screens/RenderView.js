import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKGROUND_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
const RenderView = ({user, phoneNumber}) => {
  if (phoneNumber.length < 10) {
    return (
      <View
        style={{
          padding: '4%',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}>
        <View style={{alignItems: 'center'}}>
          <Icon name="phone-square" size={48} color={MAIN_COLOR} />
          <Text
            style={{
              padding: '2%',
              fontWeight: '400',
              fontSize: 16,
              color: '#000',
              textAlign: 'center',
            }}>
            Nhập số điện thoại để tìm kiếm người dùng
          </Text>
        </View>
      </View>
    );
  }
  switch (user) {
    case null:
      return (
        <View
          style={{
            height: '30%',
            padding: '4%',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}>
          <Text style={{fontWeight: '600', fontSize: 16, color: '#000'}}>
            Kết quả tìm kiếm
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5%',
            }}>
            <View style={{alignItems: 'center'}}>
              <Icon name="exclamation-triangle" size={48} color={MAIN_COLOR} />
              <Text
                style={{
                  padding: '2%',
                  fontWeight: '400',
                  fontSize: 16,
                  color: '#000',
                  textAlign: 'center',
                }}>
                Số điện thoại chưa đăng ký tài khoản hoặc không cho phép tìm
                kiếm
              </Text>
            </View>
          </View>
        </View>
      );
    default:
      return (
        <View
          style={{
            height: '30%',
            padding: '4%',
            flexDirection: 'column',
            backgroundColor: '#fff',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{fontWeight: '600', fontSize: 16, color: '#000'}}>
              Kết quả tìm kiếm
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 0.6,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: user.user.avatar}}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#fff',
                  margin: 15,
                }}
              />
              <View>
                <Text style={{fontWeight: '400', fontSize: 16, color: '#000'}}>
                  {user.user.full_name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text>Số điện thoại: </Text>
                  <Text style={{color: '#21e688'}}>{user.user.phone}</Text>
                </View>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#c0ffd2',
                  paddingHorizontal: '10%',
                  paddingVertical: '4%',
                  borderRadius: 25,
                }}>
                <Text style={{color: '#1dc071', textTransform: 'uppercase'}}>
                  Kết bạn
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
  }
};

export {RenderView};
