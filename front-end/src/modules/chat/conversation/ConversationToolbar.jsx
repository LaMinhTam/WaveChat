import { useForm } from "react-hook-form";
import { IconCard, IconFile, IconImage } from "../../../components/icons";
import useS3File from "../../../hooks/useS3File";
import PropTypes from "prop-types";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import useS3ImageConversation from "../../../hooks/useS3ImageConversation";
import { toast } from "react-toastify";

const ConversationToolbar = ({ socket, user_id }) => {
    const { setValue, getValues } = useForm();
    const { conversationId, setConversationId } = useChat();

    const { handleUploadFile } = useS3File(getValues);
    const { handleUploadImage } = useS3ImageConversation(getValues);

    const handleSelectFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("file_name", file.name);
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
    };

    const handleSelectImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("file_name", file.name);
        const timestamp = new Date().getTime();
        const type = file.type;
        const fileType = file.type.split("/")[0];
        const fileName = file.name;
        const size = file.size;
        if (fileType === "image") {
            handleUploadImage(file, timestamp);
            await handleSendFile(fileName, type, size, timestamp);
        } else {
            toast.error("Please select a image");
            return;
        }
        e.target.value = null;
    };

    const handleSendFile = async (fileName, fileType, size = 0, timestamp) => {
        const type = fileType.split("/")[0];
        if (!socket) return;
        if (!conversationId) {
            const res = await axiosPrivate.post("/conversation/create", {
                member_id: user_id,
            });
            setConversationId(res.data.data.conversation_id);
            const clientFile = {
                conversation_id: res.data.data.conversation_id,
                type: type === "image" ? 2 : 5,
                message: type === "image" ? "Hình ảnh" : "Tệp tin",
                media: `${fileType};${timestamp}-${fileName};${size}`,
                created_at: "",
            };
            socket.emit("message", clientFile);
        } else {
            const clientFile = {
                conversation_id: conversationId,
                type: type === "image" ? 2 : 5,
                message: type === "image" ? "Hình ảnh" : "Tệp tin",
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
};

export default ConversationToolbar;
