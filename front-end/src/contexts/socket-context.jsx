import React, { useEffect, useState } from "react";
import { getToken, getUserId } from "../utils/auth";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import {
    setIncomingMessageOfConversation,
    setShowConversation,
} from "../store/commonSlice";
import { setId } from "../store/conversationSlice";
import { axiosPrivate } from "../api/axios";
import { toast } from "react-toastify";
import { useChat } from "./chat-context";
const SocketContext = React.createContext();

export function SocketProvider(props) {
    const [socket, setSocket] = React.useState(null);
    const accessToken = getToken();
    const currentUserId = getUserId();
    const [message, setMessage] = React.useState([]);
    const { conversationId } = useChat();
    const [unreadCount, setUnreadCount] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const resetTitle = () => {
            document.title = "Wave chat";
        };

        window.addEventListener("focus", resetTitle);

        return () => {
            window.removeEventListener("focus", resetTitle);
        };
    }, []);

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io("ws://localhost:3000", {
            extraHeaders: {
                Authorization: accessToken,
            },
            query: { device: currentUserId },
        });

        newSocket.on("connect", () => {
            async function fetchMessage() {
                const res = await axiosPrivate.get(
                    `/message/${conversationId}?limit=100000`
                );
                if (res.data.status === 200) {
                    const data = res.data.data;
                    if (data) {
                        data.reverse();
                        setMessage(data);
                    } else {
                        setMessage([]);
                    }
                } else if (res.data.status === 400) {
                    toast.error(res.data.message);
                    dispatch(setShowConversation(false));
                    dispatch(setId(Math.random() * 1000));
                    return;
                }
            }
            if (conversationId) fetchMessage();
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        newSocket.on("message", (incomingMessage) => {
            const updatedMessage = incomingMessage.message;
            setMessage((prev) =>
                Array.isArray(prev)
                    ? [...prev, updatedMessage]
                    : [updatedMessage]
            );
            dispatch(
                setIncomingMessageOfConversation(
                    `${updatedMessage.conversation_id}_${updatedMessage.message}`
                )
            );
            dispatch(
                setId(
                    setIncomingMessageOfConversation(
                        `${updatedMessage.conversation_id}_${updatedMessage.message}`
                    )
                )
            );
            if (document.hidden) {
                document.title = `Bạn có tin nhắn mới từ ${updatedMessage.user.full_name}!`;
                setUnreadCount((prevCount) => prevCount + 1); // Increment unread messages count
            }
        });

        newSocket.on("revoke-message", (data) => {
            // modify message to tin nhắn đã thu hồi
            setMessage((prev) =>
                prev.map((msg) => {
                    if (msg._id === data.message._id) {
                        return {
                            ...msg,
                            type: 14,
                            message: "Tin nhắn đã thu hồi",
                        };
                    }
                    return msg;
                })
            );
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [accessToken, conversationId, currentUserId, dispatch, setMessage]);

    const contextValues = {
        socket,
        message,
        setMessage,
        unreadCount,
        setUnreadCount,
    };
    return (
        <SocketContext.Provider
            value={contextValues}
            {...props}
        ></SocketContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
    const context = React.useContext(SocketContext);
    if (typeof context === "undefined")
        throw new Error("useSocket must be used within SocketProvider");
    return context;
}
