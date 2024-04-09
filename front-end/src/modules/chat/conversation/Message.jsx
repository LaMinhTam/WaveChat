import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import { IconLike } from "../../../components/icons";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import Viewer from "react-viewer";
import { useEffect, useState } from "react";
import s3ConversationUrl from "../../../utils/s3ConversationUrl";
import { useSelector } from "react-redux";
import useHover from "../../../hooks/useHover";
import { toast } from "react-toastify";
import { useChat } from "../../../contexts/chat-context";
import handleFormatMessage from "../../../utils/handleFormatMessage";
import typeToReaction, { reactionToType } from "../../../utils/reactionOfType";
import { axiosPrivate } from "../../../api/axios";
import MessageFile from "./message/MessageFile";
import MessageImage from "./message/MessageImage";
import MessageVideo from "./message/MessageVideo";
import MessageReply from "./message/MessageReply";
import MessageFeature from "./message/MessageFeature";
import ModalChatOption from "../../../components/modal/ModalChatOption";
const Message = ({ msg, type, socket, onDeleteMessage }) => {
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [reactionEmoji, setReactionEmoji] = useState("");
    const [imageList, setImageList] = useState([]);
    const { hovered, nodeRef } = useHover();
    const { hovered: hoveredReaction, nodeRef: nodeRefReaction } = useHover();
    const progress = useSelector((state) => state.common.progress);
    const currentFileName = useSelector(
        (state) => state.common.currentFileName
    );

    const messageShowOption = useSelector(
        (state) => state.common.messageShowOption
    );

    const {
        setReplyMessage,
        setIsOpenReply,
        messageRefs,
        setShowChatOptionModal,
        showChatOptionModal,
    } = useChat();

    const handleReplyMessage = () => {
        setReplyMessage(msg);
        setIsOpenReply(true);
    };

    const handleDeleteReaction = async () => {
        try {
            const type = reactionToType(reactionEmoji);
            const res = await axiosPrivate.post("/message/react", {
                message_id: msg._id,
                type: type,
            });
            if (res.data.status === 200) {
                setReactionEmoji("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleReaction = async (reaction) => {
        console.log(reaction?.emoji);
        try {
            const type = reactionToType(reaction?.emoji);
            const res = await axiosPrivate.post("/message/react", {
                message_id: msg._id,
                type: type,
            });
            if (res.data.status === 200) {
                let emojiReaction = typeToReaction(type);
                setReactionEmoji(emojiReaction);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRecallMessage = () => {
        if (!socket || !msg.conversation_id || !msg._id) return;
        else {
            if (type === "send") {
                socket.emit("revoke-message", {
                    conversation_id: msg.conversation_id,
                    message_id: msg._id,
                });
                setShowChatOptionModal(false);
            } else {
                toast.error("Bạn không thể thu hồi tin nhắn của người khác!");
            }
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(msg.message).then(() => {
            setShowChatOptionModal(false);
        });
    };

    useEffect(() => {
        if (msg.type === 2 && msg?.media?.length > 0) {
            let imageList = msg.media.map((media) => {
                let fileName = media.split(";")[1];
                return s3ConversationUrl(fileName, msg.conversation_id);
            });
            setImageList(imageList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (msg?.reaction?.length > 0) {
            let emojiReaction = typeToReaction(msg.reaction[0].type);
            setReactionEmoji(emojiReaction);
        }
    }, [msg.reaction]);

    return (
        <>
            <div ref={nodeRef}>
                <div className="flex items-center justify-center gap-x-3">
                    {type === "receive" && (
                        <div className="w-10 h-10 rounded-full">
                            <img
                                src={s3ImageUrl(
                                    msg.user?.avatar,
                                    msg.user?._id
                                )}
                                alt=""
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-center ml-auto">
                        {type === "send" && (
                            <div className="flex items-center justify-center gap-x-3">
                                {showChatOptionModal &&
                                    msg._id === messageShowOption && (
                                        <ModalChatOption
                                            onRecallMessage={
                                                handleRecallMessage
                                            }
                                            onDeleteMessage={onDeleteMessage}
                                            onCopyToClipboard={
                                                handleCopyToClipboard
                                            }
                                            className={`w-[200px] h-[200px] bg-lite text-sm ml-[120px] mb-10 z-50`}
                                        />
                                    )}
                                {type === "send" &&
                                    hovered &&
                                    msg?.type !== 14 && (
                                        <MessageFeature
                                            msg={msg}
                                            handleReplyMessage={
                                                handleReplyMessage
                                            }
                                        />
                                    )}
                            </div>
                        )}
                        <div className="flex flex-col p-3 bg-opacity-50 rounded-md gap-y-2 bg-tertiary custom-message__block">
                            <MessageReply msg={msg} messageRefs={messageRefs} />
                            <span>{handleFormatMessage(msg)}</span>
                            {msg.type === 5 &&
                                msg?.media?.length > 0 &&
                                msg.media.map((media) => (
                                    <MessageFile
                                        key={uuidv4()}
                                        media={media}
                                        progress={progress}
                                        currentFileName={currentFileName}
                                        conversation_id={msg.conversation_id}
                                    />
                                ))}
                            {msg.type === 3 &&
                                msg?.media?.length > 0 &&
                                msg.media.map((media) => (
                                    <MessageVideo
                                        key={uuidv4()}
                                        media={media}
                                        conversation_id={msg.conversation_id}
                                        progress={progress}
                                        currentFileName={currentFileName}
                                    />
                                ))}
                            {msg.type === 2 && msg?.media?.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {msg.media.map((media) => (
                                        <MessageImage
                                            key={uuidv4()}
                                            media={media}
                                            conversation_id={
                                                msg.conversation_id
                                            }
                                            setIsOpenImage={setIsOpenImage}
                                        />
                                    ))}
                                </div>
                            )}
                            <span className="text-sm text-text3">
                                {formatDate(msg.created_at)}
                            </span>

                            {msg.type !== 14 && (
                                <>
                                    <button
                                        ref={nodeRefReaction}
                                        className={`absolute bottom-[-20px] ${
                                            type === "send"
                                                ? "right-0"
                                                : "left-0"
                                        }`}
                                    >
                                        {hoveredReaction && !reactionEmoji && (
                                            <Picker
                                                reactionsDefaultOpen={true}
                                                onReactionClick={handleReaction}
                                                className="z-50"
                                            />
                                        )}
                                        {reactionEmoji ? (
                                            <span
                                                className="text-[24px]"
                                                onClick={handleDeleteReaction}
                                            >
                                                {reactionEmoji}
                                            </span>
                                        ) : (
                                            <IconLike />
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                        {type === "receive" && (
                            <div className="flex items-center justify-center gap-x-3">
                                {hovered && msg?.type !== 14 && (
                                    <MessageFeature
                                        msg={msg}
                                        handleReplyMessage={handleReplyMessage}
                                    />
                                )}
                                {showChatOptionModal &&
                                    msg._id === messageShowOption && (
                                        <ModalChatOption
                                            onRecallMessage={
                                                handleRecallMessage
                                            }
                                            onDeleteMessage={onDeleteMessage}
                                            onCopyToClipboard={
                                                handleCopyToClipboard
                                            }
                                            className={`w-[200px] h-[200px] bg-lite text-sm ml-[120px] mb-10 z-50`}
                                        />
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Viewer
                visible={isOpenImage}
                onClose={() => {
                    setIsOpenImage(false);
                }}
                images={imageList.map((src) => ({ src }))}
            />
        </>
    );
};
Message.propTypes = {
    msg: PropTypes.object,
    type: PropTypes.string.isRequired,
    socket: PropTypes.object,
    onDeleteMessage: PropTypes.func,
};

export default Message;
