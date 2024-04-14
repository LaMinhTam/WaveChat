import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../../contexts/chat-context";
import PropTypes from "prop-types";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { CONVERSATION_MEMBER_PERMISSION } from "../../api/constants";
import Swal from "sweetalert2";
import handleGrantPermission from "../../utils/handleGrantPermission";
import {
    setIsSubAdmin,
    setListMemberOfConversation,
} from "../../store/conversationSlice";

const MemberOptionModal = ({
    onRemoveMember,
    className,
    isAdminClick,
    isSubAdminClick,
    conversationId,
    userClicked,
}) => {
    const { memberOptionRef } = useChat();
    const isSubAdmin = useSelector((state) => state.conversation.isSubAdmin);
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const { setShowPassPermissionModal } = useChat();
    const dispatch = useDispatch();
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    const handleLeaveGroup = async () => {
        try {
            if (!isAdmin) {
                const res = await axiosPrivate.post(
                    `/conversation-group/leave?conversation_id=${conversationId}`
                );
                if (res.data.status === 200) {
                    toast.success(`Bạn đã rời nhóm`);
                }
            } else {
                Swal.fire({
                    title: "Bạn cần chuyển quyền cho người khác trước khi rời nhóm",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Chuyển quyền",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setShowPassPermissionModal(true);
                    } else {
                        return;
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={className} ref={memberOptionRef}>
            {isAdmin && isAdminClick && (
                <button
                    className="px-3 hover:bg-text6 w-full h-[36px]"
                    onClick={handleLeaveGroup}
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
                            let updatedListMember =
                                listMemberOfConversation.map((member) => {
                                    if (
                                        member.user_id === userClicked.user_id
                                    ) {
                                        return {
                                            ...member,
                                            permission:
                                                CONVERSATION_MEMBER_PERMISSION.MEMBER,
                                        };
                                    }
                                    return member;
                                });
                            dispatch(
                                setListMemberOfConversation(updatedListMember)
                            );
                            dispatch(setIsSubAdmin(false));
                            isSubAdminClick = false;
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
                                CONVERSATION_MEMBER_PERMISSION.DEPUTY,
                                userClicked.user_id,
                                userClicked.full_name,
                                conversationId
                            );
                            let updatedListMember =
                                listMemberOfConversation.map((member) => {
                                    if (
                                        member.user_id === userClicked.user_id
                                    ) {
                                        return {
                                            ...member,
                                            permission:
                                                CONVERSATION_MEMBER_PERMISSION.DEPUTY,
                                        };
                                    }
                                    return member;
                                });

                            dispatch(
                                setListMemberOfConversation(updatedListMember)
                            );
                            dispatch(setIsSubAdmin(true));
                            isSubAdminClick = true;
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
};

export default MemberOptionModal;
