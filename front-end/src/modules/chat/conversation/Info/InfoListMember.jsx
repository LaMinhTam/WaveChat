import { IconAddGroup, IconHorizontalMore } from "../../../../components/icons";
import { useSelector } from "react-redux";
import s3ImageUrl from "../../../../utils/s3ImageUrl";
import { CONVERSATION_MEMBER_PERMISSION } from "../../../../api/constants";
import { axiosPrivate } from "../../../../api/axios";
import { useChat } from "../../../../contexts/chat-context";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setListMemberOfConversation } from "../../../../store/conversationSlice";
import MemberOptionModal from "../../../../components/modal/MemberOptionModal";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const InfoListMember = () => {
    const [memberId, setMemberId] = useState("");
    const [adminId, setAdminId] = useState("");
    const dispatch = useDispatch();
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const { conversationId, showMemberOption, setShowMemberOption } = useChat();
    useEffect(() => {
        if (!adminId) {
            let admin = listMemberOfConversation.find(
                (member) =>
                    member.permission === CONVERSATION_MEMBER_PERMISSION.OWNER
            );
            setAdminId(admin?._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleRemoveMember = async (id) => {
        try {
            const res = await axiosPrivate.post(
                `/conversation-group/remove-member?conversation_id=${conversationId}`,
                {
                    user_id: id,
                }
            );
            console.log("handleRemoveMember ~ res:", res);
            if (res.data.status) {
                let newListMember = listMemberOfConversation.filter(
                    (member) => member._id !== id
                );
                dispatch(setListMemberOfConversation(newListMember));
                toast.success("Xóa thành viên thành công");
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra khi xóa thành viên");
        }
    };
    return (
        <div>
            <div className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4">
                <IconAddGroup />
                <span>{`Danh sách thành viên (${listMemberOfConversation?.length})`}</span>
            </div>
            <div className="flex flex-col px-4 py-2 gap-y-2">
                {listMemberOfConversation.map((member) => (
                    <div
                        key={uuidv4()}
                        className="relative flex items-center px-4 py-2 gap-x-3 hover:bg-text6"
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
                        {isAdmin && (
                            <>
                                <button
                                    className="ml-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMemberId(member.user_id);
                                        setShowMemberOption(true);
                                    }}
                                >
                                    <IconHorizontalMore />
                                </button>
                                {showMemberOption &&
                                    memberId === member.user_id && (
                                        <MemberOptionModal
                                            isAdminClick={memberId === adminId}
                                            onRemoveMember={() =>
                                                handleRemoveMember(
                                                    member.user_id
                                                )
                                            }
                                            className={`flex flex-col items-start justify-center p-2 
                                            gap-y-3 absolute z-50 shadow-md min-w-[140px] h-[72px] 
                                            bg-lite text-sm top-10 right-0`}
                                        />
                                    )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoListMember;
