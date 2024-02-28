import { useSelector } from "react-redux";
import ConversationChatInput from "./ConversationChatInput";
import ConversationContent from "./ConversationContent";
import ConversationHeader from "./ConversationHeader";
import ConversationToolbar from "./ConversationToolbar";
import { useEffect, useState } from "react";
import { getToken, getUserId } from "../../../utils/auth";
import { useChat } from "../../../contexts/chat-context";
import io from "socket.io-client";

const Conversation = () => {
    const friendInfo = useSelector((state) => state.user.friendInfo);
    const [socket, setSocket] = useState(null);
    const accessToken = getToken();
    const { setMessage } = useChat();
    const currentUserId = getUserId();

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io("ws://localhost:3000", {
            extraHeaders: {
                Authorization: accessToken,
            },
            query: { device: currentUserId },
        });

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        newSocket.on("message", (incomingMessage) => {
            // handle created_at has time format like createAt
            incomingMessage.message.created_at =
                incomingMessage.message.createdAt;
            setMessage((prev) =>
                Array.isArray(prev)
                    ? [...prev, incomingMessage.message]
                    : [incomingMessage.message]
            );
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [accessToken, currentUserId, setMessage]);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <ConversationHeader
                name={friendInfo.full_name}
                status={"Vừa truy cập"}
                avatar={friendInfo.avatar}
                userId={friendInfo._id}
            />
            <ConversationContent />
            <div className="mt-auto shadow-md">
                <ConversationToolbar user_id={friendInfo._id} socket={socket} />
                <ConversationChatInput
                    user_id={friendInfo._id}
                    socket={socket}
                />
            </div>
        </div>
    );
};

export default Conversation;
