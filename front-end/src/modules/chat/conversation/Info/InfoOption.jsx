import {
    IconAddGroup,
    IconCopy,
    IconFile,
    IconForward,
} from "../../../../components/icons";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setShowListMemberInGroup } from "../../../../store/commonSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useChat } from "../../../../contexts/chat-context";

const InfoOption = ({ number }) => {
    const dispatch = useDispatch();
    const linkJoinGroup = useSelector(
        (state) => state.conversation.linkJoinGroup
    );
    const { conversationId } = useChat();
    let link = "";
    if (linkJoinGroup) {
        link = `wavechat.me/g/conversation/${conversationId}?link_join=${linkJoinGroup}`;
    }
    const { setShowForwardModal } = useChat();
    const handleCopyLink = () => {
        link = "https://" + link;
        navigator.clipboard.writeText(link);
        toast.success("Đã sao chép");
    };

    return (
        <div className="flex flex-col w-full h-[96px] text-text1 text-sm font-normal border-b-8">
            <div className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 py-2 cursor-pointer">
                <IconFile />
                <div
                    className="flex flex-col items-start justify-center"
                    onClick={handleCopyLink}
                >
                    <span>Link tham gia nhóm</span>
                    <span className="text-secondary line-clamp-1">{link}</span>
                </div>
                <div className="flex items-center justify-center ml-auto gap-x-2">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-text6 hover:bg-text7"
                    >
                        <IconCopy />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowForwardModal(true);
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-text6 hover:bg-text7"
                    >
                        <IconForward />
                    </button>
                </div>
            </div>
            <button
                className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4"
                onClick={() => dispatch(setShowListMemberInGroup(true))}
            >
                <IconAddGroup />
                <span>{`${number} Thành viên`}</span>
            </button>
        </div>
    );
};

InfoOption.propTypes = {
    number: PropTypes.number.isRequired,
};

export default InfoOption;