import { useChat } from "../../contexts/chat-context";
import PropTypes from "prop-types";

const MemberOptionModal = ({ onRemoveMember, className, isAdminClick }) => {
    console.log("MemberOptionModal ~ isAdminClick:", isAdminClick);
    const { memberOptionRef } = useChat();
    return (
        <div className={className} ref={memberOptionRef}>
            {!isAdminClick ? (
                <>
                    <button className="px-3 hover:bg-text6 w-full h-[36px]">
                        Thêm phó nhóm
                    </button>
                    <button
                        className="px-3 hover:bg-text6 w-full h-[36px]"
                        onClick={onRemoveMember}
                    >
                        Xóa khỏi nhóm
                    </button>
                </>
            ) : (
                <button className="px-3 hover:bg-text6 w-full h-[36px]">
                    Rời nhóm
                </button>
            )}
        </div>
    );
};
MemberOptionModal.propTypes = {
    onRemoveMember: PropTypes.func,
    className: PropTypes.string,
    isAdminClick: PropTypes.bool,
};

export default MemberOptionModal;
