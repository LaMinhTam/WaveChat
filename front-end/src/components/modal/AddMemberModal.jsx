import { axiosPrivate } from "../../api/axios";
import { useChat } from "../../contexts/chat-context";
import SearchPerson from "../../modules/chat/group/create/SearchPerson";
import { IconClose } from "../icons";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CONVERSATION_MEMBER_PERMISSION } from "../../api/constants";
import { setListMemberOfConversation } from "../../store/conversationSlice";
import { useEffect, useState } from "react";

const AddMemberModal = () => {
    const dispatch = useDispatch();
    const [isInviteToWaitingList, setIsInviteToWaitingList] = useState(false);
    const {
        setShowAddMemberModal,
        addMemberModalRef,
        selectedList,
        setSelectedList,
        conversationId,
    } = useChat();
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    const isConfirmNewMember = useSelector(
        (state) => state.conversation.isConfirmNewMember
    );
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const isSubAdmin = useSelector((state) => state.conversation.isSubAdmin);

    useEffect(() => {
        if (isConfirmNewMember) {
            if (isAdmin || isSubAdmin) {
                setIsInviteToWaitingList(false);
            } else {
                setIsInviteToWaitingList(true);
            }
        }
    }, [isAdmin, isConfirmNewMember, isSubAdmin]);
    const handleAddMember = async () => {
        try {
            let members = selectedList.map((member) => member.user_id);
            const res = await axiosPrivate.post(
                `/conversation-group/add-member?conversation_id=${conversationId}`,
                {
                    members,
                }
            );
            if (res.data.status === 200) {
                if (isInviteToWaitingList) {
                    toast.success(
                        "Đã thêm người dùng vào danh sách chờ xác nhận!"
                    );
                } else {
                    toast.success("Thêm thành công");
                    let listNewMember = selectedList.map((member) => {
                        return {
                            ...member,
                            permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
                        };
                    });
                    let newListMember =
                        listMemberOfConversation.concat(listNewMember);
                    dispatch(setListMemberOfConversation(newListMember));
                }
                setShowAddMemberModal(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra");
        }
    };
    return (
        <div ref={addMemberModalRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">Thêm thành viên</span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setSelectedList([]);
                        setShowAddMemberModal(false);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <SearchPerson type="add-member" />
            <div className="border border-t-2 border-gray-300">
                <div className="py-[14px] px-4 flex items-center">
                    <div></div>
                    <div className="flex items-center ml-auto gap-x-3">
                        <button
                            className="px-4 py-2 bg-text6"
                            onClick={() => setShowAddMemberModal(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-secondary text-lite disabled:bg-opacity-30"
                            onClick={handleAddMember}
                            disabled={selectedList.length === 0}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
