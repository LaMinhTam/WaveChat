import { useForm } from "react-hook-form";
import { IconCard, IconFile, IconImage } from "../../../components/icons";
import useS3File from "../../../hooks/useS3File";
import PropTypes from "prop-types";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import useS3ImageNew from "../../../hooks/useS3ImageNew";

const ConversationToolbar = ({ socket, user_id }) => {
    const { setValue, getValues } = useForm();
    const { conversationId, setConversationId } = useChat();

    const { handleUploadFile } = useS3File(getValues);
    const { handleUploadImage } = useS3ImageNew(getValues);

    const handleSelectFile = async (e) => {
        const file = e.target.files[0];
        console.log("handleSelectFile ~ file:", file);
        if (!file) return;
        setValue("file_name", file.name);
        const type = file.type.split("/")[0];
        const fileName = file.name;
        if (type === "image") {
            handleUploadImage(file);
            await handleSendFile(fileName, type);
        } else {
            handleUploadFile(file);
            await handleSendFile(fileName, type);
        }
    };

    const handleSendFile = async (fileName, fileType) => {
        if (!socket) return;
        if (!conversationId) {
            const res = await axiosPrivate.post("/conversation/create", {
                member_id: user_id,
            });
            setConversationId(res.data.data.conversation_id);
            const clientFile = {
                conversation_id: res.data.data.conversation_id,
                type: fileType === "image" ? 2 : 5,
                media: fileName,
                created_at: "",
            };
            socket.emit("message", clientFile);
        } else {
            const clientFile = {
                conversation_id: conversationId,
                type: fileType === "image" ? 2 : 5,
                media: fileName,
                created_at: "",
            };
            socket.emit("message", clientFile);
        }
    };

    return (
        <div className="w-full flex items-center pl-2 h-[46px] bg-lite border-b border-text3">
            <div className="flex items-center justify-center gap-x-2">
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconImage />
                </button>
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
