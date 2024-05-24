import {
    IconForward,
    IconHorizontalMore,
    IconReply,
} from "../../../../components/icons";
import { useChat } from "../../../../contexts/chat-context";
import { setMessageShowOption } from "../../../../store/commonSlice";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const MessageFeature = ({ msg, handleReplyMessage }) => {
    const { setShowForwardModal, setForwardMessage, setShowChatOptionModal } =
        useChat();

    const dispatch = useDispatch();

    return (
        <>
            <div className="w-[116px] h-[24px] flex items-center justify-between bg-lite p-2 ml-auto">
                <button onClick={handleReplyMessage}>
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
        </>
    );
};

MessageFeature.propTypes = {
    dispatch: PropTypes.func,
    msg: PropTypes.object,
    handleReplyMessage: PropTypes.func,
};

export default MessageFeature;
