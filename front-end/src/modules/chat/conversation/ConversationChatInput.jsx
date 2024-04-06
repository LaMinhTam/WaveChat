import { IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";
import Picker from "emoji-picker-react";

import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";
import { useState } from "react";

const ConversationChatInput = ({ user_id, socket }) => {
    const [messageSend, setMessageSend] = useState("");
    const { conversationId, setConversationId } = useChat();
    const [chosenEmoji, setChosenEmoji] = useState(null);
    console.log("ConversationChatInput ~ chosenEmoji:", chosenEmoji);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEnterPress = async (e) => {
        if (e.key === "Enter") {
            await handleSendMessage();
        }
    };

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setMessageSend((prevState) =>
            prevState ? prevState + emojiObject.emoji : emojiObject.emoji
        );
    };

    const handleShowEmoji = () => {
        setShowEmojiPicker(!showEmojiPicker);
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
            setMessageSend("");
        } else {
            const message = {
                conversation_id: conversationId,
                message: messageSend,
                type: 1,
                created_at: "",
            };
            socket.emit("message", message);
            setMessageSend("");
        }
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
                        onClick={handleShowEmoji}
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

            {showEmojiPicker && (
                <Picker
                    onEmojiClick={onEmojiClick}
                    className="absolute bottom-[550px] left-[500px]"
                />
            )}
        </>
    );
};

ConversationChatInput.propTypes = {
    user_id: PropTypes.string,
    socket: PropTypes.object,
};

export default ConversationChatInput;
