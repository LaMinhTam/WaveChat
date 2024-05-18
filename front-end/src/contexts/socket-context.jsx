import React, { useEffect, useState } from "react";
import { getToken, getUserId } from "../utils/auth";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import {
    setIncomingMessageOfConversation,
    setShowConversation,
    setShowConversationInfo,
    setShowConversationPermission,
} from "../store/commonSlice";
import { setId } from "../store/conversationSlice";
import { axiosPrivate } from "../api/axios";
import { toast } from "react-toastify";
import { useChat } from "./chat-context";
import axios from "axios";
// import Peer from "simple-peer";
const SocketContext = React.createContext();

export function SocketProvider(props) {
    const [socket, setSocket] = React.useState(null);
    const [showVideoCallModal, setShowVideoCallModal] = useState(false);
    const [calledUser, setCalledUser] = useState({});
    const [requestVideoCallData, setRequestVideoCallData] = useState({});
    const [receiveCalledVideo, setReceiveCalledVideo] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callDenied, setCallDenied] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const accessToken = getToken();
    const currentUserId = getUserId();
    const [message, setMessage] = React.useState([]);
    const { conversationId, currentConversation } = useChat();
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
            console.log("Connected to WebSocket");
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
            if (
                conversationId &&
                currentConversation.conversation_id !== conversationId
            ) {
                console.log("fetching message");
                fetchMessage();
            }
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

        newSocket.on("new-conversation", (data) => {
            dispatch(setId(data.data.conversation_id));
        });

        newSocket.on("disband-group", ({ data }) => {
            dispatch(setId(data.conversation_id));
            dispatch(setShowConversationPermission(false));
            dispatch(setShowConversation(false));
            dispatch(setShowConversationInfo(false));
        });

        newSocket.on("request-call-video", (data) => {
            console.log("newSocket.on ~ data:", data);
            setReceiveCalledVideo(true);
            setRequestVideoCallData(data);
            setCallAccepted(false);
            setShowVideoCallModal(true);
        });

        newSocket.on("deny-call-video", (data) => {
            console.log("deny-call-video", data);
            setCallDenied(true);
            setReceiveCalledVideo(false);
            setCalledUser({});
            setRequestVideoCallData({});
            setShowVideoCallModal(false);
        });

        newSocket.on("answer-call-video", async (signal) => {
            console.log("socket.on ~ signal:", signal);
            setCallAccepted(true);
            setReceiveCalledVideo(false);
            setCallDenied(false);
        });

        setSocket(newSocket);
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [
        accessToken,
        conversationId,
        currentConversation.conversation_id,
        currentUserId,
        dispatch,
        setMessage,
    ]);

    async function createRoom() {
        try {
            const response = await axios.post(
                import.meta.env.VITE_DAILY_API_URL,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_DAILY_API_KEY
                        }`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create room: ${error.message}`);
        }
    }

    async function getRoom(roomId) {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_DAILY_API_URL}/${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_DAILY_API_KEY
                        }`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get room: ${error.message}`);
        }
    }

    async function deleteRoom(roomId) {
        try {
            await axios.delete(
                `${import.meta.env.VITE_DAILY_API_URL}/${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_DAILY_API_KEY
                        }`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            throw new Error(`Failed to delete room: ${error.message}`);
        }
    }

    const contextValues = {
        socket,
        message,
        setMessage,
        unreadCount,
        setUnreadCount,
        showVideoCallModal,
        setShowVideoCallModal,
        calledUser,
        setCalledUser,
        requestVideoCallData,
        setRequestVideoCallData,
        receiveCalledVideo,
        setReceiveCalledVideo,
        callAccepted,
        setCallAccepted,
        callDenied,
        setCallDenied,
        createRoom,
        getRoom,
        deleteRoom,
        callEnded,
        setCallEnded,
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
