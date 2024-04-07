import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import {
    IconCSV,
    IconDocs,
    IconDownload,
    IconFileDefault,
    IconForward,
    IconHorizontalMore,
    IconLike,
    IconPdf,
    IconReply,
    IconTxt,
    IconXLSX,
} from "../../../components/icons";
import ReactPlayer from "react-player";
import formatSize from "../../../utils/formatSize";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import Viewer from "react-viewer";
import { useEffect, useRef, useState } from "react";
import s3ConversationUrl from "../../../utils/s3ConversationUrl";
import { useDispatch, useSelector } from "react-redux";
import useHover from "../../../hooks/useHover";
import { toast } from "react-toastify";
import { useChat } from "../../../contexts/chat-context";
import ModalChatOption from "../../../components/modal/ModalChatOption";
import { setMessageShowOption } from "../../../store/commonSlice";
import handleFormatMessage from "../../../utils/handleFormatMessage";
import handleDownloadFile from "../../../utils/handleDownLoadFile";
import IconVideo from "../../../components/icons/IconVideo";
import typeToReaction, { reactionToType } from "../../../utils/reactionOfType";
import { axiosPrivate } from "../../../api/axios";
const Message = ({ msg, type, socket, onDeleteMessage }) => {
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [reactionEmoji, setReactionEmoji] = useState("");
    const [imageList, setImageList] = useState([]);
    const [position, setPosition] = useState({
        top: "0px",
        topSub: "0px",
        left: "0px",
        right: "0px",
    });
    const { hovered, nodeRef } = useHover();
    const { hovered: hoveredReaction, nodeRef: nodeRefReaction } = useHover();
    const progress = useSelector((state) => state.common.progress);
    const currentFileName = useSelector(
        (state) => state.common.currentFileName
    );
    const messageRef = useRef(null);

    const {
        setShowChatOptionModal,
        showChatOptionModal,
        setShowForwardModal,
        setForwardMessage,
    } = useChat();
    const messageShowOption = useSelector(
        (state) => state.common.messageShowOption
    );

    const dispatch = useDispatch();

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

    useEffect(() => {
        if (msg.message === "Hình ảnh" && msg?.media?.length > 0) {
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

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (messageRef.current) {
                const width = messageRef.current.offsetWidth;
                const height = messageRef.current.offsetHeight;
                const offsetLeft = messageRef.current.offsetLeft;
                const offsetRight =
                    messageRef.current.offsetParent.offsetWidth -
                    width -
                    offsetLeft;
                const top = `${height / 2 - 12}`;
                const topSub = `${height / 2 - 12 + 100}`;
                const left = `${offsetLeft + width - 35}`;
                const right = `${offsetRight + width - 35}`;
                setPosition({ top, topSub, left, right });
            }
        });

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            if (messageRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(messageRef.current);
            }
        };
    }, []);

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
                    <div
                        ref={messageRef}
                        className={`relative flex flex-col items-start justify-center p-3 rounded gap-y-2 bg-tertiary custom-message__block ml-auto`}
                    >
                        <span>{handleFormatMessage(msg)}</span>
                        {msg.message === "Tệp tin" &&
                            msg?.media?.length > 0 &&
                            msg.media.map((media) => {
                                let fileType = media.split(";")[0];
                                let fileName = media.split(";")[1];
                                let file_name = fileName.split("-")[1];
                                const fileUri = s3ConversationUrl(
                                    fileName,
                                    msg.conversation_id,
                                    "file"
                                );

                                let type = fileType.split("/")[0];
                                let fileExtension = fileName.split(".")[1];
                                let size = media.split(";")[2];
                                return (
                                    <div key={uuidv4()}>
                                        <div className="flex flex-col items-center gap-y-2 w-[376px]">
                                            {type === "video" && (
                                                <ReactPlayer
                                                    url={fileUri}
                                                    controls
                                                    width="100%"
                                                    height="200px"
                                                    config={{
                                                        file: {
                                                            attributes: {
                                                                controlsList:
                                                                    "nodownload",
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
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
                                                    {type !== "video" &&
                                                        fileExtension !==
                                                            "pdf" &&
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
                                                    {type === "video" && (
                                                        <IconVideo />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-wrap">
                                                            {file_name}
                                                        </span>

                                                        <div className="flex items-center justify-between">
                                                            {progress > 0 &&
                                                                currentFileName ===
                                                                    file_name && (
                                                                    <div className="w-full h-2 bg-gray-200 rounded">
                                                                        <div
                                                                            className="h-full text-xs text-center text-white bg-blue-500 rounded"
                                                                            style={{
                                                                                width: `${progress}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            <span className="flex-shrink-0 text-xs text-text3">
                                                                {formatSize(
                                                                    size
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="flex items-center justify-center ml-auto rounded w-7 h-7 bg-lite"
                                                    disabled={progress > 0}
                                                    onClick={() =>
                                                        handleDownloadFile(
                                                            fileName,
                                                            msg.conversation_id
                                                        )
                                                    }
                                                >
                                                    <IconDownload />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {msg.message === "Hình ảnh" &&
                            msg?.media?.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {msg.media.map((media) => {
                                        let fileName = media.split(";")[1];
                                        const imageUri = s3ConversationUrl(
                                            fileName,
                                            msg.conversation_id
                                        );
                                        return (
                                            <div key={uuidv4()}>
                                                <div
                                                    className="w-[250px] h-[250px] rounded cursor-pointer"
                                                    onClick={() =>
                                                        setIsOpenImage(true)
                                                    }
                                                >
                                                    <img
                                                        src={imageUri}
                                                        alt=""
                                                        className="object-cover w-full h-full rounded"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                imageUri;
                                                            return;
                                                        }}
                                                    />
                                                </div>

                                                <Viewer
                                                    visible={isOpenImage}
                                                    onClose={() => {
                                                        setIsOpenImage(false);
                                                    }}
                                                    images={imageList.map(
                                                        (src) => ({ src })
                                                    )}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        <span className="text-sm text-text3">
                            {formatDate(msg.created_at)}
                        </span>
                    </div>
                    {type === "receive" && msg.type !== 14 && (
                        <>
                            <button
                                ref={nodeRefReaction}
                                className="absolute bottom-[-20px] right-0"
                            >
                                {hoveredReaction && !reactionEmoji && (
                                    <Picker
                                        reactionsDefaultOpen={true}
                                        onReactionClick={handleReaction}
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

                {hovered && msg?.type !== 14 && (
                    <div
                        style={{
                            top: `${position.top}px`,
                            right:
                                type === "send"
                                    ? `${position.right}px`
                                    : "auto",
                            left:
                                type === "receive"
                                    ? `${position.left}px`
                                    : "auto",
                        }}
                        className={`absolute px-8 py-2 w-[350px] h-[300px]`}
                    >
                        <div className="w-[116px] h-[24px] flex items-center justify-between bg-lite p-2">
                            <button>
                                <IconReply />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowForwardModal(true);
                                    setForwardMessage(msg);
                                }}
                            >
                                <IconForward />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(setMessageShowOption(msg._id));
                                    setShowChatOptionModal(true);
                                }}
                            >
                                <IconHorizontalMore />
                            </button>
                        </div>
                    </div>
                )}
                {showChatOptionModal && msg._id === messageShowOption && (
                    <ModalChatOption
                        onRecallMessage={handleRecallMessage}
                        onDeleteMessage={onDeleteMessage}
                        style={{
                            top: `-${position.topSub}px`,
                            right:
                                type === "send"
                                    ? `${position.right}px`
                                    : "auto",
                            left:
                                type === "receive"
                                    ? `${position.left}px`
                                    : "auto",
                            position: "absolute",
                        }}
                        className={`w-[200px] h-[150px] bg-lite text-sm p-2 ml-[120px] mb-10 z-50`}
                    />
                )}
            </div>
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
