import { useState } from "react";
import { useChat } from "../../contexts/chat-context";
import SearchPerson from "../../modules/chat/group/create/SearchPerson";
import { IconCamera, IconClose } from "../icons";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import { useDispatch } from "react-redux";
import { setId } from "../../store/conversationSlice";

const CreateGroupChatModal = () => {
    const { setShowCreateGroupChat, groupChatRef } = useChat();
    const [groupChatName, setGroupChatName] = useState("");
    const { selectedList, setSelectedList } = useChat();
    const dispatch = useDispatch();
    const handleCreateGroupChat = async () => {
        if (selectedList.length < 2) {
            toast.error("Nhóm chat phải có ít nhất 3 người");
            return;
        } else {
            // Create group chat
            const member_ids = selectedList.map((person) => person.user_id);
            const res = await axiosPrivate.post("/conversation-group/create", {
                name: groupChatName,
                member_ids,
                background: "abc.jpg",
            });
            dispatch(setId(res.data.data.conversation_id));
            setGroupChatName("");
            setShowCreateGroupChat(false);
            toast.success("Tạo nhóm chat thành công");
        }
    };
    return (
        <div ref={groupChatRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">Tạo nhóm</span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setShowCreateGroupChat(false);
                        setSelectedList([]);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <div className="border border-t-2 border-gray-300">
                <div className="flex items-center justify-center h-20 px-4 gap-x-2">
                    <button className="flex items-center justify-center w-[48px] h-[48px] rounded-full border border-text3">
                        <IconCamera />
                    </button>
                    <input
                        type="text"
                        placeholder="Nhập tên nhóm..."
                        className="flex-1 h-10 px-2 border-b border-gray-300 focus:outline-none focus:border-secondary"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </div>
                <SearchPerson />
                <div className="py-[14px] px-4 flex items-center">
                    <div></div>
                    <div className="flex items-center ml-auto gap-x-3">
                        <button
                            className="px-4 py-2 bg-text6"
                            onClick={() => setShowCreateGroupChat(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-secondary text-lite"
                            onClick={handleCreateGroupChat}
                        >
                            Tạo nhóm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CreateGroupChatModal;
