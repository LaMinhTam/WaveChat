import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [
            {
                conversation_id: "65befe408193815c04203a59",
                name: "",
                type: 2,
                is_pinned: 0,
                is_notify: 0,
                is_hidden: 0,
                is_confirm_new_member: 0,
                no_of_member: 2,
                no_of_not_seen: 0,
                no_of_waiting_confirm: 0,
                my_permission: 0,
                avatar: "",
                background: "",
                members: [
                    {
                        _id: "65bee5ff8193815c0420399e",
                        avatar: "",
                        full_name: "Nguyen Van A",
                    },
                    {
                        _id: "65bcc0fa36d9712ae07a4d2b",
                        avatar: "cr7_siuuuuu.jpg",
                        full_name: "VO DINH THONG",
                    },
                ],
                position: 1707015744289.7952,
                created_at: 1707008507368,
                updated_at: 1707008507368,
                last_activity: 1707015744289.7952,
                last_connect: "",
            },
            {
                conversation_id: "65c091b52932e8458058b212",
                name: "",
                type: 2,
                is_pinned: 0,
                is_notify: 0,
                is_hidden: 0,
                is_confirm_new_member: 0,
                no_of_member: 2,
                no_of_not_seen: 0,
                no_of_waiting_confirm: 0,
                my_permission: 0,
                avatar: "",
                background: "",
                members: [
                    {
                        _id: "65bee5ff8193815c0420399e",
                        avatar: "",
                        full_name: "Nguyen Van A",
                    },
                    {
                        _id: "65bcc81b36d9712ae07a4d32",
                        avatar: "",
                        full_name: "Cao Hoàng Nguyên",
                    },
                ],
                position: 1707119029945.3384,
                created_at: 1707096384825,
                updated_at: 1707096384825,
                last_activity: 1707119029945.3384,
                last_connect: "",
            },
        ],
    },
    reducers: {},
});
// export const {} = conversationSlice.actions;
export default conversationSlice.reducer;
