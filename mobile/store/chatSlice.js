import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [
      {
        conversation_id: '65bc6457a732dac5bab21699',
        name: '',
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
    addConversation: (state, action) => {
      const newConversation = action.payload;
      state.conversations.push(newConversation);
    },
  },
});

export const {receiveMessage, setCurrentConversation, addConversation} =
  chatSlice.actions;
export const selectConversations = state => state.chatSlide.conversations;
export default chatSlice.reducer;
