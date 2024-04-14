import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../../contexts/chat-context";
import PropTypes from "prop-types";
import { CONVERSATION_MEMBER_PERMISSION } from "../../api/constants";
import handleGrantPermission from "../../utils/handleGrantPermission";
import { setTriggerFetchListMember } from "../../store/commonSlice";
import handleLeaveGroup from "../../utils/handleLeaveGroup";

const MemberOptionModal = ({
    onRemoveMember,
    className,
    isAdminClick,
    isSubAdminClick,
    conversationId,
    userClicked,
    setSubAdminId,
}) => {
    const { memberOptionRef, setShowMemberOption } = useChat();
    const isSubAdmin = useSelector((state) => state.conversation.isSubAdmin);
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const { setShowPassPermissionModal } = useChat();
    const dispatch = useDispatch();
    const triggerFetchListMember = useSelector(
        (state) => state.common.triggerFetchListMember
    );

    return (
        <div className={className} ref={memberOptionRef}>
            {isAdmin && isAdminClick && (
                <button
                    className="px-3 hover:bg-text6 w-full h-[36px]"
                    onClick={() =>
                        handleLeaveGroup(
                            conversationId,
                            setShowPassPermissionModal,
                            isAdmin
                        )
                    }
                >
                    Rời nhóm
                </button>
            )}
            {isSubAdmin && isAdminClick && (
                <button className="px-3 hover:bg-text6 w-full h-[36px]">
                    Xem trang cá nhân
                </button>
            )}
            {isAdmin && isSubAdminClick && (
                <>
                    <button
                        className="px-3 hover:bg-text6 w-full h-[36px]"
                        onClick={async () => {
                            await handleGrantPermission(
                                "remove",
                                CONVERSATION_MEMBER_PERMISSION.MEMBER,
                                userClicked.user_id,
                                userClicked.full_name,
                                conversationId
                            );
                            dispatch(
                                setTriggerFetchListMember(
                                    !triggerFetchListMember
                                )
                            );
                            setSubAdminId("");
                            setShowMemberOption(false);
                        }}
                    >
                        Xóa phó nhóm
                    </button>
                    <button
                        className="px-3 hover:bg-text6 w-full h-[36px]"
                        onClick={onRemoveMember}
                    >
                        Xóa khỏi nhóm
                    </button>
                </>
            )}

            {isAdmin && !isSubAdminClick && !isAdminClick && (
                <>
                    <button
                        className="px-3 hover:bg-text6 w-full h-[36px]"
                        onClick={async () => {
                            await handleGrantPermission(
                                "add",
                                CONVERSATION_MEMBER_PERMISSION.DEPUTY,
                                userClicked.user_id,
                                userClicked.full_name,
                                conversationId
                            );
                            dispatch(
                                setTriggerFetchListMember(
                                    !triggerFetchListMember
                                )
                            );
                            setSubAdminId(userClicked.user_id);
                            setShowMemberOption(false);
                        }}
                    >
                        Thêm phó nhóm
                    </button>
                    <button
                        className="px-3 hover:bg-text6 w-full h-[36px]"
                        onClick={onRemoveMember}
                    >
                        Xóa khỏi nhóm
                    </button>
                </>
            )}

            {isSubAdmin && isSubAdminClick && (
                <button className="px-3 hover:bg-text6 w-full h-[36px]">
                    Rời nhóm
                </button>
            )}

            {isSubAdmin && !isAdminClick && !isSubAdminClick && (
                <button
                    className="px-3 hover:bg-text6 w-full h-[36px]"
                    onClick={onRemoveMember}
                >
                    Xóa khỏi nhóm
                </button>
            )}
        </div>
    );
};
MemberOptionModal.propTypes = {
    onRemoveMember: PropTypes.func,
    className: PropTypes.string,
    isAdminClick: PropTypes.bool,
    isSubAdminClick: PropTypes.bool,
    conversationId: PropTypes.string,
    userClicked: PropTypes.object.isRequired,
    setSubAdminId: PropTypes.func,
};

export default MemberOptionModal;
