import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [
      {
        conversation_id: '65bc6457a732dac5bab21699',
        name: '',
        type: 2,
        is_pinned: 0,
        is_notify: 0,
        is_hidden: 0,
        is_confirm_new_member: 0,
        no_of_member: 2,
        no_of_not_seen: 0,
        no_of_waiting_confirm: 0,
        my_permission: 0,
        avatar: '',
        background: '',
        members: [
          {
            _id: '65ba099fe5b15de630705064',
            avatar: 'https://source.unsplash.com/random',
            full_name: 'La Minh Tâm',
          },
          {
            _id: '65ba5e6d9df41eb9113415eb',
            avatar: 'https://source.unsplash.com/random',
            full_name: 'Andy',
          },
        ],
        position: 1706845271285.1743,
        created_at: 1706844708502,
        updated_at: 1706844708502,
        last_activity: 1706845271285.1743,
        last_connect: '',
      },
    ],
    currentConversation: {},
    socket: null,
  },
  reducers: {
    receiveMessage: (state, action) => {
      const {user, conversation, message} = action.payload;

      const existingConversation = state.conversations.find(
        c => c._id === conversation._id,
      );

      if (existingConversation) {
        existingConversation.messages.unshift(message);

        existingConversation.unreadMessages += 1;
      } else {
        state.conversations.unshift({
          ...conversation,
          messages: [message],
          unreadMessages: 1,
        });
      }
    },
    setCurrentConversation: (state, action) => {
      const {conversation, userInfo} = action.payload;

      if (conversation.type === 2) {
        const otherMember = conversation.members.find(
          member => member._id !== userInfo._id,
        );

        if (otherMember) {
          state.currentConversation = {
            ...conversation,
            name: otherMember.full_name,
            avatar: otherMember.avatar,
          };
        } else {
          state.currentConversation = conversation;
        }
      } else {
        state.currentConversation = conversation;
      }
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const {receiveMessage, setCurrentConversation, setSocket} =
  chatSlice.actions;
export const selectConversations = state => state.chatSlide.conversations;
export const selectCurrentConversation = state =>
  state.chatSlide.currentConversation;
export const selectSocket = state => state.chatSlide.socket;
export default chatSlice.reducer;
