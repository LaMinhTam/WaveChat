import { useSelector } from "react-redux";
import ConversationChatInput from "./ConversationChatInput";
import ConversationContent from "./ConversationContent";
import ConversationHeader from "./ConversationHeader";
import ConversationToolbar from "./ConversationToolbar";
import { useEffect, useState } from "react";
import ConversationInfo from "./ConversationInfo";
import { motion } from "framer-motion";
import { useSocket } from "../../../contexts/socket-context";

const Conversation = () => {
    const friendInfo = useSelector((state) => state.user.friendInfo);
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );
    const { message, socket } = useSocket();

    const [imageMessage, setImageMessage] = useState([]);
    const [fileMessage, setFileMessage] = useState([]);

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
