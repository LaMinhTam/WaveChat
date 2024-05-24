import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  MemberApprovalToggle,
  getWaitingMember,
  memberWaitingBehavior,
} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';

const MemberApproval = () => {
  const {
    currentConversation,
    setCurrentConversation,
    messages,
    setConversations,
  } = useSocket();
  const {userInfo, friends, setFriends, accessTokens} = useUserData();
  const [waitingMember, setWaitingMember] = useState([]);
  useEffect(() => {
    const fetchWaitingMember = async () => {
      const res = await getWaitingMember(currentConversation._id, accessTokens);
      setWaitingMember(res.data);
    };
    fetchWaitingMember();
  }, []);

  return (
    <View style={{padding: 5}}>
      <View
        style={{
          padding: 5,
          marginVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#ddd',
          borderWidth: 1,
          borderRadius: 10,
        }}>
        <Text style={{color: '#333'}}>Duyệt thành viên</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#0d6efd',
            borderRadius: 5,
            padding: 10,
          }}
          onPress={async () => {
            const data = await MemberApprovalToggle(
              currentConversation._id,
              accessTokens,
            );
            console.log(
              'currentConversation.my_permission',
              currentConversation.my_permission,
            );
            setCurrentConversation({
              ...currentConversation,
              is_confirm_new_member:
                currentConversation.is_confirm_new_member === 1 ? 0 : 1,
            });
            console.log('MemberApprovalToggle', data);
          }}>
          <Text style={{color: '#fff'}}>
            {currentConversation.is_confirm_new_member === 1 ? 'Bật' : 'Tắt'}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{color: '#333'}}>Danh sách chờ duyệt</Text>
        {waitingMember.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                padding: 5,
                marginVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{
                    uri: item.avatar,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <Text style={{color: '#333'}}>{item.full_name}</Text>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0d6efd',
                    borderRadius: 5,
                    padding: 10,
                  }}
                  onPress={async () => {
                    const data = await memberWaitingBehavior(
                      currentConversation._id,
                      [item.user_id],
                      1,
                      accessTokens,
                    );
                    console.log('data', data);
                    const newWaitingMember = waitingMember.filter(
                      member => member._id !== item._id,
                    );
                    setWaitingMember(newWaitingMember);
                    setCurrentConversation({
                      ...currentConversation,
                      virtual_members: [
                        ...currentConversation.virtual_members,
                        {
                          ...item,
                          permission: 0,
                        },
                      ],
                    });
                  }}>
                  <Text style={{color: '#fff'}}>Duyệt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#dc3545',
                    borderRadius: 5,
                    padding: 10,
                  }}
                  onPress={async () => {
                    const data = await memberWaitingBehavior(
                      currentConversation._id,
                      [item.user_id],
                      0,
                      accessTokens,
                    );
                    console.log(data);
                    const newWaitingMember = waitingMember.filter(
                      member => member._id !== item._id,
                    );
                    setWaitingMember(newWaitingMember);
                  }}>
                  <Text style={{color: '#fff'}}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MemberApproval;
