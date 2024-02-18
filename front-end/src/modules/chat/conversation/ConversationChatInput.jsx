import { IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getToken } from "../../../utils/auth";
import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";

const ConversationChatInput = ({ user_id }) => {
    const [messageSend, setMessageSend] = useState("");
    const [socket, setSocket] = useState(null);
    const accessToken = getToken();
    const { conversationId, setConversationId, setMessage } = useChat();
    console.log("ConversationChatInput ~ conversationId:", conversationId);

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io("ws://localhost:3000", {
            extraHeaders: {
                Authorization: accessToken,
            },
            query: { device: user_id },
        });

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        newSocket.on("message-text", (incomingMessage) => {
            setMessage((prev) =>
                Array.isArray(prev)
                    ? [...prev, incomingMessage]
                    : [incomingMessage]
            );
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [accessToken, setMessage, user_id]);

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
            socket.emit("message-text", message);
            setMessageSend("");
        } else {
            const message = {
                conversation_id: conversationId,
                message: messageSend,
                type: 1,
                created_at: "",
            };
            socket.emit("message-text", message);
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
};

export default ConversationChatInput;
