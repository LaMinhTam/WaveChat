import { getUserId } from "../../../utils/auth";
import groupMessages from "../../../utils/groupMessage";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import { toast } from "react-toastify";

const ConversationContent = ({ message, socket }) => {
    const { conversationId, setShowChatOptionModal } = useChat();
    const currentUserId = getUserId();
    const [groupedMessages, setGroupedMessages] = useState([]);
    // scroll to bottom
    useEffect(() => {
        const chatContent = document.getElementById("chat-content");
        setTimeout(() => {
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 100);
    }, [message]);

    useEffect(() => {
        if (message) {
            const grouped = groupMessages(message);
            setGroupedMessages(grouped);
        }
    }, [message]);

    const handleDeleteMessage = async (id) => {
        try {
            const res = await axiosPrivate.post(`/message/delete/${id}`);
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
                className="flex-1 w-full h-full max-h-[570px] overflow-y-auto custom-scrollbar bg-strock p-2 relative"
                id="chat-content"
            >
                {groupedMessages.map((group) => (
                    <div key={uuidv4()} className="flex flex-col items-center">
                        <span className="mb-2 text-sm text-text3">
                            {group?.data.length > 0 && group?.formattedTime}
                        </span>
                        {group?.data.map((msg) => {
                            if (msg?.conversation_id === conversationId) {
                                return (
                                    <Message
                                        key={uuidv4()}
                                        msg={msg}
                                        type={
                                            msg?.user?._id === currentUserId
                                                ? "send"
                                                : "receive"
                                        }
                                        socket={socket}
                                        currentUserId={currentUserId}
                                        onDeleteMessage={() =>
                                            handleDeleteMessage(msg._id)
                                        }
                                    />
                                );
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
