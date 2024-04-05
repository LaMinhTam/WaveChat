import { useDispatch, useSelector } from "react-redux";
import ConversationChatInput from "./ConversationChatInput";
import ConversationContent from "./ConversationContent";
import ConversationHeader from "./ConversationHeader";
import ConversationToolbar from "./ConversationToolbar";
import { useEffect, useState } from "react";
import { getToken, getUserId } from "../../../utils/auth";
import { useChat } from "../../../contexts/chat-context";
import io from "socket.io-client";
import ConversationInfo from "./ConversationInfo";
import { motion } from "framer-motion";
import { setIncomingMessageOfConversation } from "../../../store/commonSlice";
import { setId } from "../../../store/conversationSlice";

const Conversation = () => {
    const friendInfo = useSelector((state) => state.user.friendInfo);
    const [socket, setSocket] = useState(null);
    const accessToken = getToken();
    const { message, setMessage } = useChat();
    const currentUserId = getUserId();
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );

    const [imageMessage, setImageMessage] = useState([]);
    const [fileMessage, setFileMessage] = useState([]);
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
        setImageMessage([]);
        setFileMessage([]);
        message.forEach((msg) => {
            if (msg.type === 2) {
                setImageMessage((prev) =>
                    Array.isArray(prev)
                        ? [
                              ...prev,
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                        : [
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                );
            } else if (msg.type === 5) {
                setFileMessage((prev) =>
                    Array.isArray(prev)
                        ? [
                              ...prev,
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                        : [
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                );
            }
        });
    }, [message]);

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
            const updatedMessage = {
                ...incomingMessage.message,
                user: {
                    ...incomingMessage.message.user,
                    avatar: friendInfo.avatar,
                },
            };

            setMessage((prev) =>
                Array.isArray(prev)
                    ? [...prev, updatedMessage]
                    : [updatedMessage]
            );
            dispatch(
                setIncomingMessageOfConversation(
                    `${incomingMessage.message.conversation_id}_${incomingMessage.message.message}`
                )
            );
            dispatch(
                setId(
                    setIncomingMessageOfConversation(
                        `${incomingMessage.message.conversation_id}_${incomingMessage.message.message}`
                    )
                )
            );
            if (document.hidden) {
                document.title = "Bạn có tin nhắn mới!";
            }
        });

        newSocket.on("revoke-message", (data) => {
            // modify message to tin nhắn đã thu hồi
            setMessage((prev) =>
                prev.map((msg) => {
                    if (msg._id === data.message._id) {
                        return {
                            ...msg,
                            message: "Tin nhắn đã thu hồi",
                        };
                    }
                    return msg;
                })
            );
        });

        // newSocket.on("typing-on", (data) => {
        //     alert("Typing...");
        //     alert(`${data.user_id} is typing...`);
        // });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [accessToken, currentUserId, dispatch, friendInfo.avatar, setMessage]);

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col w-full h-full min-h-screen">
                <ConversationHeader
                    name={friendInfo.full_name}
                    avatar={friendInfo.avatar}
                    userId={friendInfo._id}
                />
                <ConversationContent message={message} socket={socket} />
                <div className="mt-auto shadow-md">
                    <ConversationToolbar
                        user_id={friendInfo._id}
                        socket={socket}
                    />
                    <ConversationChatInput
                        user_id={friendInfo._id}
                        socket={socket}
                    />
                </div>
            </div>
            {showConversationInfo && (
                <motion.div
                    initial={{ x: "344px" }}
                    animate={{ x: 0 }}
                    exit={{ x: "344px" }}
                    transition={{ duration: 0.3 }}
                >
                    <ConversationInfo
                        name={friendInfo.full_name}
                        avatar={friendInfo.avatar}
                        userId={friendInfo._id}
                        images={imageMessage}
                        files={fileMessage}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default Conversation;
