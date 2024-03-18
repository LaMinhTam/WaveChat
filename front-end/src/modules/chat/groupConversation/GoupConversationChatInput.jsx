import { IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";
import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";
import { useState } from "react";

const GroupConversationChatInput = ({ groupId, socket }) => {
    const [messageSend, setMessageSend] = useState("");
    const { setConversationId } = useChat(); // Assuming the group conversation ID is managed outside of this component

    const onEnterPress = async (e) => {
        if (e.key === "Enter") {
            await handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!socket) return;

        // Create a new conversation if it doesn't exist
        if (!groupId) {
            // Assuming you have an API endpoint to create a group conversation
            const res = await axiosPrivate.post("/conversation/createGroup", {
                // Additional data like group name, members, etc. can be sent here
            });

            // Assuming the response includes the newly created group conversation ID
            setConversationId(res.data.data.conversation_id);

            // Update the groupId with the newly created conversation ID
            const message = {
                conversation_id: res.data.data.conversation_id,
                message: messageSend,
                type: 1, // Assuming 1 represents a text message
                created_at: "", // You may set the appropriate timestamp here
            };

            // Emit the message to the server
            socket.emit("group_message", message);
            setMessageSend(""); // Clear the input field after sending the message
        } else {
            const message = {
                conversation_id: groupId,
                message: messageSend,
                type: 1, // Assuming 1 represents a text message
                created_at: "", // You may set the appropriate timestamp here
            };

            // Emit the message to the server
            socket.emit("group_message", message);
            setMessageSend(""); // Clear the input field after sending the message
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

GroupConversationChatInput.propTypes = {
    groupId: PropTypes.string, // Pass the groupId as a prop
    socket: PropTypes.object.isRequired, // Require the socket object as a prop
};

export default GroupConversationChatInput;
