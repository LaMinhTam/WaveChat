import React, { useEffect, useState } from "react";
import { getToken, getUserId } from "../utils/auth";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
    setIncomingMessageOfConversation,
    setShowConversation,
    setShowConversationInfo,
    setShowConversationPermission,
    setTriggerFetchListMember,
} from "../store/commonSlice";
import { setId } from "../store/conversationSlice";
import { axiosPrivate } from "../api/axios";
import { toast } from "react-toastify";
import { useChat } from "./chat-context";
import axios from "axios";
import { WAVE_CHAT_SOCKET_URL } from "../constants/global";
import { WAVE_CHAT_API } from "../api/constants";
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
    const { conversationId, currentConversation, setCurrentConversation } =
        useChat();
    const [unreadCount, setUnreadCount] = useState(0);
    const dispatch = useDispatch();
    const triggerFetchListMember = useSelector(
        (state) => state.common.triggerFetchListMember
    );

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
        const newSocket = io(WAVE_CHAT_SOCKET_URL, {
            extraHeaders: {
                Authorization: accessToken,
            },
            query: { device: currentUserId },
        });

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
            async function fetchMessage() {
                const res = await axiosPrivate.get(
                    WAVE_CHAT_API.listMessage(conversationId, 10000)
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
            if (conversationId) {
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
            dispatch(setId(Math.random() * 1000));
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

        newSocket.on("add-member", (response) => {
            const isExist = response.data.last_message.user_target.some(
                (member) => {
                    return member.user_id === currentUserId;
                }
            );
            if (!isExist) {
                if (conversationId !== response.data.conversation_id) {
                    dispatch(setId(response.data.conversation_id));
                } else {
                    const newMessage = {
                        ...response.data.last_message,
                        conversation_id: response.data.conversation_id,
                        _id: response.data.last_message.message_id,
                        user: {
                            _id: response.data.last_message.user_id,
                            full_name: response.data.last_message.full_name,
                            avatar: response.data.last_message.avatar,
                        },
                        created_at: response.data.last_message.created_at,
                        updated_at: response.data.last_message.created_at,
                    };
                    setMessage((prev) =>
                        Array.isArray(prev)
                            ? [...prev, newMessage]
                            : [newMessage]
                    );
                    dispatch(
                        setTriggerFetchListMember(!triggerFetchListMember)
                    );
                }
            } else {
                dispatch(setId(response.data.last_message.message_id));
            }
        });

        newSocket.on("remove-member", (response) => {
            if (conversationId !== response.data.conversation_id) {
                dispatch(setId(response.data.last_message.message_id));
            } else {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
                dispatch(setTriggerFetchListMember(!triggerFetchListMember));
            }
        });

        newSocket.on("leave-group", (response) => {
            if (conversationId !== response.data.conversation_id) {
                dispatch(setId(response.data.last_message.message_id));
            } else {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
                dispatch(setTriggerFetchListMember(!triggerFetchListMember));
            }
        });

        newSocket.on("is-confirm-member", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
            }
        });

        newSocket.on("update-join-with-link", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
            }
        });

        newSocket.on("join-with-link", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
                if (currentUserId !== response.data.owner_id) {
                    dispatch(
                        setTriggerFetchListMember(!triggerFetchListMember)
                    );
                }
            }
        });

        newSocket.on("update-permission", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
                if (currentUserId !== response.data.owner_id) {
                    dispatch(
                        setTriggerFetchListMember(!triggerFetchListMember)
                    );
                }
            }
        });

        newSocket.on("update-name-group", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
                dispatch(setId(Math.random() * 1000));
                setCurrentConversation({
                    ...currentConversation,
                    name: response.data.name,
                });
            } else {
                dispatch(setId(Math.random() * 1000));
            }
        });

        newSocket.on("update-background", (response) => {
            if (conversationId === response.data.conversation_id) {
                const newMessage = {
                    ...response.data.last_message,
                    conversation_id: response.data.conversation_id,
                    _id: response.data.last_message.message_id,
                    user: {
                        _id: response.data.last_message.user_id,
                        full_name: response.data.last_message.full_name,
                        avatar: response.data.last_message.avatar,
                    },
                    created_at: response.data.last_message.created_at,
                    updated_at: response.data.last_message.created_at,
                };
                setMessage((prev) =>
                    Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
                );
            }
        });

        newSocket.on("request-call-video", (data) => {
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
        currentConversation,
        currentConversation.conversation_id,
        currentUserId,
        dispatch,
        setCurrentConversation,
        setMessage,
        triggerFetchListMember,
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
