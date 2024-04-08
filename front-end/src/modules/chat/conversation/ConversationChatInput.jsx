import {
    IconCSV,
    IconClose,
    IconDocs,
    IconEmoji,
    IconFileDefault,
    IconPdf,
    IconSend,
    IconTxt,
    IconXLSX,
} from "../../../components/icons";
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

const ConversationChatInput = ({
    user_id,
    socket,
    blockType,
    setBlockType,
}) => {
    const [messageSend, setMessageSend] = useState("");
    const [listImage, setListImage] = useState([]);
    const {
        conversationId,
        setConversationId,
        setIsBlocked,
        replyMessage,
        setReplyMessage,
    } = useChat();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEnterPress = async (e) => {
        if (e.key === "Enter" && blockType === 0) {
            await handleSendMessage();
        }
    };

    const onCloseReplyMessage = () => {
        setReplyMessage({});
    };

    const handleSendMessage = async () => {
        if (blockType === 0) {
            if (!socket) return;
            if (!conversationId) {
                const res = await axiosPrivate.post("/conversation/create", {
                    member_id: user_id,
                });
                setConversationId(res.data.data.conversation_id);
                const message = {
                    conversation_id: res.data.data.conversation_id,
                    message: messageSend,
                    type: 1,
                    created_at: "",
                };
                socket.emit("message", message);
                setMessageSend("");
            } else {
                const message = {
                    conversation_id: conversationId,
                    message: messageSend,
                    type: 1,
                    created_at: "",
                };
                socket.emit("message", message);
                setMessageSend("");
            }
        } else if (blockType === 1) {
            Swal.fire({
                title: "Bạn đang chặn người dùng này! Hủy chặn?",
                text: "Bạn sẽ không thể hoàn tác hành động này!",
                icon: "Cảnh báo",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Có, hãy hủy!",
                cancelButtonText: "Không!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log("unblock user");
                    const res = await axiosPrivate.post(
                        `/user/remove-block-user/${user_id}`
                    );
                    if (res.data.status === 200) {
                        Swal.fire(
                            "Đã hủy chặn!",
                            "Người dùng đã được hủy chặn.",
                            "Thành công"
                        );
                        setBlockType(0);
                        setIsBlocked(false);
                    } else {
                        Swal.fire("Lỗi!", "Đã có lỗi xảy ra.", "error");
                    }
                } else {
                    return;
                }
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
                {replyMessage && replyMessage._id && (
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
                                        replyMessage.user.avatar,
                                        replyMessage.user._id
                                    ) || ""
                                }
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-semibold">
                                {replyMessage.user.full_name}
                            </span>
                        </div>
                        {replyMessage.type === 1 && (
                            <span className="ml-10">
                                {replyMessage.message}
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
                            replyMessage.media.map((media, index) => {
                                let fileName = media.split(";")[1];
                                let file_name = fileName.split("-")[1];
                                let fileExtension = fileName.split(".")[1];
                                let size = media.split(";")[2];
                                return (
                                    <div key={index}>
                                        <div className="flex flex-col items-center gap-y-2 w-[376px]">
                                            <div className="flex items-center w-full">
                                                <div className="flex items-center justify-center gap-x-3">
                                                    {fileExtension ===
                                                        "pdf" && <IconPdf />}
                                                    {fileExtension ===
                                                        "csv" && <IconCSV />}
                                                    {fileExtension ===
                                                        "xlsx" && <IconXLSX />}
                                                    {fileExtension ===
                                                        "docx" && <IconDocs />}
                                                    {fileExtension ===
                                                        "txt" && <IconTxt />}
                                                    {fileExtension !== "pdf" &&
                                                        fileExtension !==
                                                            "csv" &&
                                                        fileExtension !==
                                                            "xlsx" &&
                                                        fileExtension !==
                                                            "docx" &&
                                                        fileExtension !==
                                                            "txt" && (
                                                            <IconFileDefault />
                                                        )}
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
    user_id: PropTypes.string,
    socket: PropTypes.object,
    blockType: PropTypes.number,
    setBlockType: PropTypes.func,
};

export default ConversationChatInput;
