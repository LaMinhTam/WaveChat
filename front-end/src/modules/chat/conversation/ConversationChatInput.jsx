import { IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";
import { useState } from "react";

const ConversationChatInput = ({ user_id, socket, block }) => {
    const [messageSend, setMessageSend] = useState("");
    const { conversationId, setConversationId } = useChat();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEnterPress = async (e) => {
        if (e.key === "Enter") {
            await handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!block) {
            if (!socket) return;
            if (!conversationId) {
                const res = await axiosPrivate.post("/conversation/create", {
                    member_id: user_id,
                });
                setConversationId(res.data.data.conversation_id);
                const message = {
                    conversation_id: res.data.data.conversation_id,
                    message: messageSend,
                    type: 1,
                    created_at: "",
                };
                console.log("handleSendMessage ~ message:", message);
                socket.emit("message", message);
                setMessageSend("");
            } else {
                const message = {
                    conversation_id: conversationId,
                    message: messageSend,
                    type: 1,
                    created_at: "",
                };
                console.log("handleSendMessage ~ message:", message);
                socket.emit("message", message);
                setMessageSend("");
            }
        } else {
            toast.error("Người dùng đang bị chặn không thể gửi tin nhắn!");
        }
    };

    const handleChooseEmoji = (emoji) => {
        setMessageSend((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <>
            <div className="relative flex items-center w-full h-full shadow-md">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 h-12 p-[12px_10px_18px_16px] rounded-full bg-lite"
                    onChange={(e) => {
                        setMessageSend(e.target.value);
                        // handleTyping();
                    }}
                    value={messageSend}
                    onKeyDown={onEnterPress}
                />
                <div className="flex items-center justify-center gap-x-2">
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10"
                    >
                        <IconEmoji />
                    </button>
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10"
                        onClick={handleSendMessage}
                    >
                        <IconSend />
                    </button>
                </div>
            </div>
            {showEmojiPicker ? (
                <span className="absolute bottom-20">
                    <Picker data={data} onEmojiSelect={handleChooseEmoji} />
                </span>
            ) : null}
        </>
    );
};

ConversationChatInput.propTypes = {
    user_id: PropTypes.string,
    socket: PropTypes.object,
    block: PropTypes.bool,
};

export default ConversationChatInput;
