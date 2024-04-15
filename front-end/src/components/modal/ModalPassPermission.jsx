import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../utils/auth";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { CONVERSATION_MEMBER_PERMISSION } from "../../api/constants";
import { IconClose } from "../icons";
import { useChat } from "../../contexts/chat-context";
import { toast } from "react-toastify";
import handleGrantPermission from "../../utils/handleGrantPermission";
import { axiosPrivate } from "../../api/axios";
import { setId } from "../../store/conversationSlice";
import {
    setShowConversation,
    setShowConversationInfo,
} from "../../store/commonSlice";
const ModalPassPermission = () => {
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    const currentUserId = getUserId();
    const dispatch = useDispatch();
    let listMember = listMemberOfConversation.filter(
        (member) => member.user_id !== currentUserId
    );
    const { conversationId } = useChat();
    const { setShowPassPermissionModal, passPermissionModalRef } = useChat();
    const handleClickPerson = async (member) => {
        await handleGrantPermission(
            "add",
            CONVERSATION_MEMBER_PERMISSION.OWNER,
            member.user_id,
            member.full_name,
            conversationId
        );
        const res = await axiosPrivate.post(
            `/conversation-group/leave?conversation_id=${conversationId}`
        );
        if (res.data.status === 200) {
            toast.success(`Bạn đã rời nhóm`);
            dispatch(setShowConversation(false));
            dispatch(setShowConversationInfo(false));
            dispatch(setId(Math.random() * 1000));
            setShowPassPermissionModal(false);
        }
    };
    return (
        <div ref={passPermissionModalRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">
                    Chuyển quyền trưởng nhóm
                </span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setShowPassPermissionModal(false);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <div className="flex flex-col px-4 py-2 gap-y-2">
                {listMember.map((member) => {
                    console.log("{listMember.map ~ member:", member);
                    return (
                        <div
                            key={member.user_id}
                            className="relative flex items-center px-4 py-2 cursor-pointer gap-x-3 hover:bg-text6"
                            onClick={() => handleClickPerson(member)}
                        >
                            <div className="w-10 h-10 rounded-full">
                                <img
                                    src={s3ImageUrl(member.avatar)}
                                    alt={member.name}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                <span className="text-sm font-medium">
                                    {member.full_name}
                                </span>
                                <span className="text-xs text-text7">
                                    {member.permission ===
                                        CONVERSATION_MEMBER_PERMISSION.OWNER &&
                                        "Trưởng nhóm"}
                                    {member.permission ===
                                        CONVERSATION_MEMBER_PERMISSION.DEPUTY &&
                                        "Phó nhóm"}
                                    {member.permission ===
                                        CONVERSATION_MEMBER_PERMISSION.MEMBER &&
                                        "Thành viên"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ModalPassPermission;
