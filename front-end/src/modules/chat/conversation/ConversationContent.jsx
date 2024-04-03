import { getUserId } from "../../../utils/auth";
import groupMessages from "../../../utils/groupMessage";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { useEffect } from "react";
// import { IconChevronDown } from "../../../components/icons";

const ConversationContent = ({ message }) => {
    const conversation_id = message[0]?.conversation_id;
    const currentUserId = getUserId();

    // scroll to bottom
    useEffect(() => {
        const chatContent = document.getElementById("chat-content");
        chatContent.scrollTop = chatContent.scrollHeight;
    }, [message]);

    const groupedMessages = groupMessages(message);
    // const scrollToBottom = () => {
    //     const chatContent = document.getElementById("chat-content");
    //     chatContent.scrollTop = chatContent.scrollHeight;
    // };

    return (
        <div
            className="flex-1 w-full h-full max-h-[570px] overflow-y-auto custom-scrollbar bg-strock p-2 relative"
            id="chat-content"
        >
            {groupedMessages.map((group) => (
                <div key={uuidv4()} className="flex flex-col items-center">
                    <span className="mb-2 text-sm text-text3">
                        {group.formattedTime}
                    </span>
                    {group.data.map((msg) => {
                        if (msg?.conversation_id === conversation_id) {
                            return (
                                <Message
                                    key={uuidv4()}
                                    msg={msg}
                                    type={
                                        msg?.user?._id === currentUserId
                                            ? "send"
                                            : "receive"
                                    }
                                />
                            );
                        }
                    })}
                </div>
            ))}
            {/* <button
                className="w-[32px] h-[32px] flex items-center justify-center bg-lite 
                rounded-full hover:bg-primary hover:text-lite absolute bottom-0 right-0 z-[9999]"
                onClick={scrollToBottom}
            >
                <IconChevronDown />
            </button> */}
        </div>
    );
};

ConversationContent.propTypes = {
    message: PropTypes.array,
};

export default ConversationContent;
