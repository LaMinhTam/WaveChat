import { useChat } from "../../contexts/chat-context";
import { IconCopy, IconPin, IconRecall, IconTrash } from "../icons";
import PropTypes from "prop-types";

const ModalChatOption = ({ className, style, handleRecallMessage }) => {
    const { chatOptionModalRef } = useChat();
    return (
        <div className={className} ref={chatOptionModalRef} style={style}>
            <button className="flex items-center justify-center gap-x-2">
                <IconCopy />
                <span>Copy tin nhắn</span>
            </button>
            <br />
            <button className="flex items-center justify-center gap-x-2">
                <IconPin />
                <span>Ghim tin nhắn</span>
            </button>
            <br />
            <button
                className="flex items-center justify-center gap-x-2"
                onClick={handleRecallMessage}
            >
                <IconRecall />
                <span>Thu hồi</span>
            </button>
            <button className="flex items-center justify-center gap-x-2">
                <IconTrash />
                <span>Xóa chỉ ở phía tôi</span>
            </button>
        </div>
    );
};

ModalChatOption.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    handleRecallMessage: PropTypes.func,
};

export default ModalChatOption;
