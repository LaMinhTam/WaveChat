import { IconClose, IconEmoji, IconSend } from "../../../components/icons";
import PropTypes from "prop-types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { axiosPrivate } from "../../../api/axios";
import { useChat } from "../../../contexts/chat-context";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import s3ConversationUrl from "../../../utils/s3ConversationUrl";
import formatSize from "../../../utils/formatSize";
import IconVideo from "../../../components/icons/IconVideo";
import MessageFile from "./message/MessageFile";
import { v4 as uuidv4 } from "uuid";
import alertRemoveBlock from "../../../utils/alertRemoveBlock";
import { useSelector } from "react-redux";

const ConversationChatInput = ({
    user_id,
    socket,
    blockType,
    setBlockType,
}) => {
    const [listImage, setListImage] = useState([]);
    const [messageSend, setMessageSend] = useState("");
    const {
        conversationId,
        setConversationId,
        setIsBlocked,
        replyMessage,
        setReplyMessage,
        isOpenReply,
        setIsOpenReply,
    } = useChat();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);

    const onEnterPress = async (e) => {
        if (e.key === "Enter" && blockType === 0) {
            await handleSendMessage();
        }
    };

    const onCloseReplyMessage = () => {
        setReplyMessage({});
        setIsOpenReply(false);
    };

    const handleSendMessage = async () => {
        if (blockType === 0) {
            if (!socket) return;
            if (!conversationId && !isGroupChat) {
                const res = await axiosPrivate.post("/conversation/create", {
                    member_id: user_id,
                });
                setConversationId(res.data.data.conversation_id);
                let message = {};
                if (replyMessage && replyMessage._id) {
                    message = {
                        message: messageSend,
                        conversation_id: replyMessage.conversation_id,
                        type: 6,
                        message_reply_id: replyMessage._id,
                        created_at: "",
                    };
                } else {
                    message = {
                        conversation_id: res.data.data.conversation_id,
                        message: messageSend,
                        type: 1,
                        created_at: "",
                    };
                }
                setIsOpenReply(false);
                setReplyMessage("");
                setMessageSend("");
                socket.emit("message", message);
            } else {
                let message = {};
                if (replyMessage && replyMessage._id) {
                    message = {
                        message: messageSend,
                        conversation_id: replyMessage.conversation_id,
                        type: 6,
                        message_reply_id: replyMessage._id,
                        created_at: "",
                    };
                } else {
                    message = {
                        conversation_id: conversationId,
                        message: messageSend,
                        type: 1,
                        created_at: "",
                    };
                }
                setIsOpenReply(false);
                setReplyMessage("");
                setMessageSend("");
                socket.emit("message", message);
            }
        } else if (blockType === 1) {
            alertRemoveBlock({
                user_id,
                setIsBlocked,
                setBlockType,
            });
        } else if (blockType === 2) {
            Swal.fire({
                title: "Thông báo",
                text: "Bạn đã bị chặn bởi người này",
                icon: "warning",
                confirmButtonText: "OK",
            });
        }
    };

    useEffect(() => {
        if (replyMessage?.type === 2) {
            if (replyMessage?.media?.length > 0) {
                let imageList = replyMessage.media.map((media) => {
                    let fileName = media.split(";")[1];
                    return s3ConversationUrl(
                        fileName,
                        replyMessage.conversation_id
                    );
                });
                setListImage(imageList);
            }
        }
    }, [replyMessage.conversation_id, replyMessage.media, replyMessage?.type]);

    const handleChooseEmoji = (emoji) => {
        setMessageSend((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <>
            <div className="relative flex flex-col w-full h-full shadow-md">
                {isOpenReply && replyMessage && (
                    <div className="flex flex-col justify-center w-full p-3 border-b gap-y-2 bg-text6">
                        <button
                            className="absolute top-0 right-0"
                            onClick={onCloseReplyMessage}
                        >
                            <IconClose />
                        </button>
                        <div className="flex items-center gap-x-2">
                            <img
                                src={
                                    s3ImageUrl(
                                        replyMessage?.user?.avatar,
                                        replyMessage?.user?._id
                                    ) || ""
                                }
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-semibold">
                                {replyMessage?.user?.full_name}
                            </span>
                        </div>
                        {[1, 16].includes(replyMessage?.type) && (
                            <span className="ml-10">
                                {replyMessage?.message}
                            </span>
                        )}
                        {replyMessage.type === 2 && listImage.length > 0 && (
                            <div className="flex flex-wrap gap-2 ml-10">
                                {listImage.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt="image"
                                        className="object-cover w-10 h-10 rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                        {replyMessage.type === 5 &&
                            replyMessage.media.map((media) => (
                                <MessageFile
                                    key={uuidv4()}
                                    media={media}
                                    conversation_id={
                                        replyMessage.conversation_id
                                    }
                                />
                            ))}
                        {replyMessage.type === 3 &&
                            replyMessage.media.map((media) => {
                                let fileName = media.split(";")[1];
                                let file_name = fileName.split("-")[1];
                                let size = media.split(";")[2];
                                return (
                                    <div key={replyMessage._id}>
                                        <div className="flex flex-col items-center gap-y-2 w-[376px]">
                                            <div className="flex items-center w-full">
                                                <div className="flex items-center justify-center gap-x-3">
                                                    <IconVideo />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-wrap">
                                                            {file_name}
                                                        </span>
                                                        <span className="flex-shrink-0 text-xs text-text3">
                                                            {formatSize(size)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 h-12 p-[12px_10px_18px_16px] rounded-full bg-lite"
                        onChange={(e) => {
                            setMessageSend(e.target.value);
                            // handleTyping();
                        }}
                        value={messageSend}
                        onKeyDown={onEnterPress}
                    />
                    <div className="flex items-center justify-center gap-x-2">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10"
                        >
                            <IconEmoji />
                        </button>
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10"
                            onClick={handleSendMessage}
                        >
                            <IconSend />
                        </button>
                    </div>
                </div>
            </div>
            {showEmojiPicker ? (
                <span className="absolute bottom-20">
                    <Picker data={data} onEmojiSelect={handleChooseEmoji} />
                </span>
            ) : null}
        </>
    );
};

ConversationChatInput.propTypes = {
    user_id: PropTypes.any,
    socket: PropTypes.object,
    blockType: PropTypes.number,
    setBlockType: PropTypes.func,
};

export default ConversationChatInput;
