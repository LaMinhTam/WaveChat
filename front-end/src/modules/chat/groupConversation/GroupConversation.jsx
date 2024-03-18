import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getToken, getUserId } from "../../../utils/auth";
import { useChat } from "../../../contexts/chat-context";
import io from "socket.io-client";
import Member from "./Member"; // Import Member component


const GroupConversation = ({ groupId, groupName, groupMembers }) => {
    const [socket, setSocket] = useState(null);
    const accessToken = getToken();
    const { setMessage } = useChat();
    const currentUserId = getUserId();

    useEffect(() => {
        const newSocket = io("ws://localhost:3000", {
            extraHeaders: {
                Authorization: accessToken,
            },
            query: { groupId, userId: currentUserId },
        });

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        newSocket.on("group_message", (incomingMessage) => {
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
    }, [accessToken, currentUserId, groupId, setMessage]);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <div className="p-4 bg-gray-200">{groupName}</div>
            {groupMembers.map((member) => (
                <Member key={member._id} user={member} />
            ))}
            <ul>
                {groupMembers.map((member) => (
                    <li key={member.id}>{member.name}</li>
                ))}
            </ul>
            {/* Display conversation content */}
            <div className="flex-grow overflow-y-auto">
                {/* Render conversation messages */}
            </div>
            {/* Chat input */}
            <div className="p-4 bg-gray-200">
                {/* Input component */}
            </div>
        </div>
    );
};

export default GroupConversation;
