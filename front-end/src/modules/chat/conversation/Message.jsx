import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
import { v4 as uuidv4 } from "uuid";
import {
    IconCSV,
    IconDocs,
    IconDownload,
    IconFileDefault,
    IconForward,
    IconHorizontalMore,
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
const Message = ({ msg, type, socket }) => {
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [position, setPosition] = useState({
        top: "0px",
        left: "0px",
        right: "0px",
    });
    const { hovered, nodeRef } = useHover();
    const progress = useSelector((state) => state.common.progress);
    const currentFileName = useSelector(
        (state) => state.common.currentFileName
    );
    const messageRef = useRef(null);

    const { setShowChatOptionModal, showChatOptionModal } = useChat();
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
            } else {
                toast.error("Bạn không thể thu hồi tin nhắn của người khác!");
            }
        }
    };

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
                const left = `${offsetLeft + width - 20}`;
                const right = `${offsetRight + width - 20}`;
                setPosition({ top, left, right });
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
            <div
                ref={nodeRef}
                className={`max-w-[75%] relative w-full h-full m-2 ${
                    type === "send"
                        ? "ml-auto"
                        : "flex items-start gap-x-2 mr-auto"
                }`}
            >
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
                        className={`flex flex-col items-start justify-center p-3 rounded gap-y-2 bg-tertiary custom-message__block ml-auto`}
                    >
                        <span>{handleFormatMessage(msg)}</span>
                        {msg?.media?.length > 0 &&
                            msg.media.map((media) => {
                                let fileType = media.split(";")[0];
                                let fileName = media.split(";")[1];
                                let file_name = fileName.split("-")[1];
                                const imageUri = s3ConversationUrl(
                                    fileName,
                                    msg.conversation_id
                                );
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
                                        {type === "image" ? (
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
                                                        e.target.onerror = null;
                                                        e.target.src = imageUri;
                                                        return;
                                                    }}
                                                />
                                            </div>
                                        ) : (
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
                                                            "pdf" && (
                                                            <IconPdf />
                                                        )}
                                                        {fileExtension ===
                                                            "csv" && (
                                                            <IconCSV />
                                                        )}
                                                        {fileExtension ===
                                                            "xlsx" && (
                                                            <IconXLSX />
                                                        )}
                                                        {fileExtension ===
                                                            "docx" && (
                                                            <IconDocs />
                                                        )}
                                                        {fileExtension ===
                                                            "txt" && (
                                                            <IconTxt />
                                                        )}
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
                                        )}
                                        <Viewer
                                            visible={isOpenImage}
                                            onClose={() => {
                                                setIsOpenImage(false);
                                            }}
                                            images={[
                                                { src: imageUri, alt: "" },
                                            ]}
                                        />
                                    </div>
                                );
                            })}
                        <span className="text-sm text-text3">
                            {formatDate(msg.created_at)}
                        </span>
                    </div>
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
                            <button>
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
                        handleRecallMessage={handleRecallMessage}
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
                        className={`absolute w-[200px] h-[150px] bg-lite text-sm p-2 ml-[120px] mt-10 z-50`}
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
};

export default Message;
