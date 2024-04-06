import { useChat } from "../../contexts/chat-context";
import { IconCopy, IconPin, IconRecall, IconTrash } from "../icons";
import PropTypes from "prop-types";

const ModalChatOption = ({
    className,
    style,
    onRecallMessage,
    onDeleteMessage,
}) => {
    const { chatOptionModalRef } = useChat();
    return (
        <div className={className} ref={chatOptionModalRef} style={style}>
            <div className="flex flex-col gap-y-2">
                <button className="flex items-center gap-x-2">
                    <IconCopy />
                    <span>Copy tin nhắn</span>
                </button>
                <button className="flex items-center gap-x-2">
                    <IconPin />
                    <span>Ghim tin nhắn</span>
                </button>
                <button
                    className="flex items-center gap-x-2"
                    onClick={onRecallMessage}
                >
                    <IconRecall />
                    <span>Thu hồi</span>
                </button>
                <button
                    className="flex items-center gap-x-2"
                    onClick={onDeleteMessage}
                >
                    <IconTrash />
                    <span>Xóa chỉ ở phía tôi</span>
                </button>
            </div>
        </div>
    );
};

ModalChatOption.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onRecallMessage: PropTypes.func,
    onDeleteMessage: PropTypes.func,
};

export default ModalChatOption;
