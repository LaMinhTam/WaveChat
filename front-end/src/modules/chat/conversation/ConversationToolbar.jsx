import { useForm } from "react-hook-form";
import { IconCard, IconFile, IconImage } from "../../../components/icons";
import useS3File from "../../../hooks/useS3File";
import PropTypes from "prop-types";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import useS3ImageConversation from "../../../hooks/useS3ImageConversation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ConversationToolbar = ({ socket, user_id, blockType }) => {
    const { setValue, getValues } = useForm();
    const { conversationId, setConversationId } = useChat();

    const { handleUploadFile } = useS3File(getValues);
    const { handleUploadImage } = useS3ImageConversation(getValues);

    const handleSelectFile = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        files.forEach(async (file) => {
            setValue("file_name", file.name);
            setValue("conversation_id", conversationId);
            const timestamp = new Date().getTime();
            const type = file.type;
            const fileType = file.type.split("/")[0];
            const fileName = file.name;
            const size = file.size;
            if (fileType === "image") {
                toast.error("Please select a file");
                return;
            } else {
                handleUploadFile(file, timestamp);
                await handleSendFile(fileName, type, size, timestamp);
            }
            e.target.value = null;
        });
    };

    const handleSelectImage = async (e) => {
        const files = Array.from(e.target.files);
        const listFormatMessage = [];
        const timestamp = new Date().getTime();
        if (!files.length) return;
        files.forEach(async (file) => {
            setValue("file_name", file.name);
            setValue("conversation_id", conversationId);
            const type = file.type;
            const fileType = file.type.split("/")[0];
            const fileName = file.name;
            const size = file.size;
            if (fileType === "image") {
                handleUploadImage(file, timestamp);
                listFormatMessage.push(
                    `${type};${timestamp}-${fileName};${size}`
                );
            } else {
                toast.error("Please select an image");
                return;
            }
            e.target.value = null;
        });
        await handleSendImage(listFormatMessage);
    };

    useEffect(() => {
        async function createConversation() {
            const res = await axiosPrivate.post("/conversation/create", {
                member_id: user_id,
            });
            setConversationId(res.data.data.conversation_id);
        }
        if (!conversationId) {
            createConversation();
        } else {
            return;
        }
    }, [conversationId, setConversationId, user_id]);

    const handleSendImage = async (listFormatMessage) => {
        if (!socket) return;
        if (!conversationId) {
            const res = await axiosPrivate.post("/conversation/create", {
                member_id: user_id,
            });
            setConversationId(res.data.data.conversation_id);
            const clientImage = {
                conversation_id: res.data.data.conversation_id,
                type: 2,
                message: "",
                media: listFormatMessage,
                created_at: "",
            };
            socket.emit("message", clientImage);
        } else {
            const clientImage = {
                conversation_id: conversationId,
                type: 2,
                message: "",
                media: listFormatMessage,
                created_at: "",
            };
            socket.emit("message", clientImage);
        }
    };

    const handleSendFile = async (fileName, fileType, size = 0, timestamp) => {
        const typed = fileType.split("/")[0];
        if (!socket) return;
        if (!conversationId) {
            const res = await axiosPrivate.post("/conversation/create", {
                member_id: user_id,
            });
            setConversationId(res.data.data.conversation_id);
            const clientFile = {
                conversation_id: res.data.data.conversation_id,
                type: typed === "video" ? 3 : 5,
                message: "",
                media: `${fileType};${timestamp}-${fileName};${size}`,
                created_at: "",
            };
            socket.emit("message", clientFile);
        } else {
            const clientFile = {
                conversation_id: conversationId,
                type: typed === "video" ? 3 : 5,
                message: "",
                media: `${fileType};${timestamp}-${fileName};${size}`,
                created_at: "",
            };
            socket.emit("message", clientFile);
        }
    };

    return (
        <div className="w-full flex items-center pl-2 h-[46px] bg-lite border-b border-text3">
            <div className="flex items-center justify-center gap-x-2">
                <label
                    htmlFor="imageInput"
                    className="flex items-center justify-center w-10 h-10 rounded cursor-pointer hover:bg-text3 hover:bg-opacity-10"
                >
                    <IconImage />
                </label>
                <input
                    id="imageInput"
                    type="file"
                    className="hidden-input"
                    onChange={handleSelectImage}
                    multiple
                    disabled={blockType === 1 || blockType === 2}
                />
                <label
                    htmlFor="fileInput"
                    className="flex items-center justify-center w-10 h-10 rounded cursor-pointer hover:bg-text3 hover:bg-opacity-10"
                >
                    <IconFile />
                </label>
                <input
                    id="fileInput"
                    type="file"
                    className="hidden-input"
                    onChange={handleSelectFile}
                    multiple
                    disabled={blockType === 1 || blockType === 2}
                />
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconCard />
                </button>
            </div>
        </div>
    );
};

ConversationToolbar.propTypes = {
    socket: PropTypes.object,
    user_id: PropTypes.string,
    blockType: PropTypes.number,
};

export default ConversationToolbar;
