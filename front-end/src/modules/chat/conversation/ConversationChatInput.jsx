import { IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";

import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";
import { useState } from "react";

const ConversationChatInput = ({ user_id, socket }) => {
    const [messageSend, setMessageSend] = useState("");
    const { conversationId, setConversationId } = useChat();

    const onEnterPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
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
            socket.emit("message", message);
            console.log("Emit message successfully");
            setMessageSend("");
        } else {
            const message = {
                conversation_id: conversationId,
                message: messageSend,
                type: 1,
                created_at: "",
            };
            socket.emit("message", message);
            console.log("Emit message successfully");
            setMessageSend("");
        }
    };
    return (
        <div className="flex items-center w-full h-full shadow-md">
            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-12 p-[12px_10px_18px_16px] rounded-full bg-lite"
                onChange={(e) => setMessageSend(e.target.value)}
                value={messageSend}
                onKeyDown={onEnterPress}
            />
            <div className="flex items-center justify-center gap-x-2">
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
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
    );
};

ConversationChatInput.propTypes = {
    user_id: PropTypes.string,
    socket: PropTypes.object,
};

export default ConversationChatInput;
