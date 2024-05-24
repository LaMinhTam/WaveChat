import { getUserId } from "../../../utils/auth";
import groupMessages from "../../../utils/groupMessage";
import Message from "./Message";
import Notification from "./Notification";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setId } from "../../../store/conversationSlice";
import { WAVE_CHAT_API } from "../../../api/constants";

const ConversationContent = ({ message, socket }) => {
    const {
        conversationId,
        setShowChatOptionModal,
        messageRefs,
        setMessageRefs,
    } = useChat();
    const currentUserId = getUserId();
    const [groupedMessages, setGroupedMessages] = useState([]);
    // scroll to bottom
    useEffect(() => {
        const chatContent = document.getElementById("chat-content");
        setTimeout(() => {
            if (chatContent) chatContent.scrollTop = chatContent.scrollHeight;
        }, 100);
    }, [message]);

    useEffect(() => {
        if (message) {
            const grouped = groupMessages(message);
            setGroupedMessages(grouped);
        }
    }, [message]);

    useEffect(() => {
        groupedMessages.forEach((group) => {
            group?.data.forEach((msg) => {
                if (!messageRefs[msg._id]) {
                    setMessageRefs((refs) => ({
                        ...refs,
                        [msg._id]: React.createRef(),
                    }));
                }
            });
        });
    }, [groupedMessages, messageRefs, setMessageRefs]);

    const dispatch = useDispatch();

    const handleDeleteMessage = async (id) => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.deleteMessage(id)
            );
            if (res.data.status === 200) {
                const newGroup = groupedMessages
                    ?.map((group) => {
                        return {
                            ...group,
                            data: group.data.filter((msg) => msg._id !== id),
                        };
                    })
                    .filter((group) => group.data.length > 0);
                setGroupedMessages(newGroup);
                setShowChatOptionModal(false);
                dispatch(setId(Math.random() * 1000));
                toast.success("Đã xóa tin nhắn!");
            } else {
                toast.error(res.data.message || "Có lỗi xảy ra!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div
                className="flex-1 w-full h-full max-h-[570px] overflow-y-auto 
                overflow-x-hidden custom-scrollbar bg-strock p-2 relative"
                id="chat-content"
            >
                {groupedMessages.map((group) => (
                    <div key={uuidv4()} className="flex flex-col items-center">
                        <span className="mb-2 text-sm text-text3">
                            {group.formattedTime}
                        </span>
                        {group?.data.map((msg) => {
                            if (msg.conversation_id === conversationId) {
                                const check = [
                                    7, 8, 9, 10, 11, 12, 13, 15, 17, 18, 19, 20,
                                    21, 22, 23, 24, 25,
                                ].includes(msg.type);
                                if (!check) {
                                    return (
                                        <div
                                            ref={messageRefs[msg._id]}
                                            key={uuidv4()}
                                            className={`max-w-[75%] relative w-full h-full m-3 ${
                                                msg?.user?._id === currentUserId
                                                    ? "ml-auto"
                                                    : "flex items-start gap-x-2 mr-auto"
                                            }`}
                                        >
                                            <Message
                                                msg={msg}
                                                type={
                                                    msg?.user?._id ===
                                                    currentUserId
                                                        ? "send"
                                                        : "receive"
                                                }
                                                socket={socket}
                                                onDeleteMessage={() =>
                                                    handleDeleteMessage(msg._id)
                                                }
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <Notification
                                            key={uuidv4()}
                                            msg={msg}
                                            currentUserId={currentUserId}
                                        />
                                    );
                                }
                            }
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};

ConversationContent.propTypes = {
    message: PropTypes.array,
    socket: PropTypes.object,
};

export default ConversationContent;
