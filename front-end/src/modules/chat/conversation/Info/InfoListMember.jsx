import {
    IconAddGroup,
    IconAddUser,
    IconHorizontalMore,
} from "../../../../components/icons";
import { useSelector } from "react-redux";
import s3ImageUrl from "../../../../utils/s3ImageUrl";
import { CONVERSATION_MEMBER_PERMISSION } from "../../../../api/constants";
import { axiosPrivate } from "../../../../api/axios";
import { useChat } from "../../../../contexts/chat-context";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
    setId,
    setListMemberOfConversation,
    setWaitingList,
} from "../../../../store/conversationSlice";
import MemberOptionModal from "../../../../components/modal/MemberOptionModal";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CheckboxSub from "../../../../components/checkbox/CheckboxSub";
import useToggleValue from "../../../../hooks/useToggleValue";

const InfoListMember = () => {
    const [checkedList, setCheckedList] = useState([]);
    const [memberId, setMemberId] = useState("");
    const [adminId, setAdminId] = useState("");
    const [subAdminId, setSubAdminId] = useState("");
    const dispatch = useDispatch();
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    console.log(
        "InfoListMember ~ listMemberOfConversation:",
        listMemberOfConversation
    );
    const { value: checkedAll, handleToggleValue: handleToggleCheckedAll } =
        useToggleValue();
    const { value: checkedSingle, handleToggleValue: handleCheckedSingle } =
        useToggleValue();
    const waitingList = useSelector((state) => state.conversation.waitingList);
    const isSubAdmin = useSelector((state) => state.conversation.isSubAdmin);
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const { conversationId, showMemberOption, setShowMemberOption } = useChat();
    useEffect(() => {
        if (!adminId || !subAdminId) {
            let admin = listMemberOfConversation.find(
                (member) =>
                    member.permission === CONVERSATION_MEMBER_PERMISSION.OWNER
            );
            setAdminId(admin?.user_id);
            let subAdmin = listMemberOfConversation.find(
                (member) =>
                    member.permission === CONVERSATION_MEMBER_PERMISSION.DEPUTY
            );
            setSubAdminId(subAdmin?.user_id);
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
            if (res.data.status === 200) {
                let newListMember = listMemberOfConversation.filter(
                    (member) => member.user_id !== id
                );
                dispatch(setListMemberOfConversation(newListMember));
                setShowMemberOption(false);
                toast.success("Xóa thành viên thành công");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra khi xóa thành viên");
        }
    };

    const handleApprovalMember = async (type) => {
        try {
            const res = await axiosPrivate.post(
                `/conversation-group/confirm-member?conversation_id=${conversationId}`,
                {
                    members: checkedList,
                    type,
                }
            );
            if (res.data.status === 200) {
                if (type === 1) {
                    let listNewMember = waitingList.filter((member) =>
                        checkedList.includes(member.user_id)
                    );
                    listNewMember = listNewMember.map((member) => {
                        let newMember = {
                            ...member,
                            permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
                        };
                        return newMember;
                    });
                    let newListMember =
                        listMemberOfConversation.concat(listNewMember);
                    dispatch(setListMemberOfConversation(newListMember));
                    dispatch(setId(Math.random() * 1000));
                    // remove listNewMember from waitingList
                    let newWaitingList = waitingList.filter(
                        (member) => !checkedList.includes(member.user_id)
                    );
                    dispatch(setWaitingList(newWaitingList));
                    setCheckedList([]);
                } else if (type === 0) {
                    let newWaitingList = waitingList.filter(
                        (member) => !checkedList.includes(member.user_id)
                    );
                    dispatch(setWaitingList(newWaitingList));
                    setCheckedList([]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <div className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4">
                    <IconAddGroup />
                    <span>{`Danh sách thành viên (${listMemberOfConversation?.length})`}</span>
                </div>
                <div className="flex flex-col px-4 py-2 gap-y-2">
                    {listMemberOfConversation?.map((member) => (
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
                            {(isAdmin || isSubAdmin) && (
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
                                                isAdminClick={
                                                    member.user_id === adminId
                                                }
                                                isSubAdminClick={
                                                    member.user_id ===
                                                    subAdminId
                                                }
                                                onRemoveMember={() =>
                                                    handleRemoveMember(
                                                        member.user_id
                                                    )
                                                }
                                                setSubAdminId={setSubAdminId}
                                                conversationId={conversationId}
                                                userClicked={member}
                                                className={`flex flex-col items-start justify-center p-2 
                                                gap-y-3 absolute z-50 shadow-md min-w-[140px] h-[100px] 
                                                bg-lite text-sm top-10 right-0`}
                                            />
                                        )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {(isAdmin || isSubAdmin) && (
                <div>
                    <div className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4">
                        <IconAddUser />
                        <span>{`Danh sách chờ phê duyệt (${waitingList?.length})`}</span>
                    </div>
                    {waitingList.length > 0 && (
                        <>
                            <div className="flex items-center justify-between px-4">
                                <span>Chọn tất cả</span>
                                <CheckboxSub
                                    checked={checkedAll}
                                    name={`chkChooseAll`}
                                    onClick={() => {
                                        if (checkedAll) {
                                            setCheckedList([]);
                                            handleToggleCheckedAll(false);
                                        } else {
                                            setCheckedList(
                                                waitingList.map(
                                                    (member) => member.user_id
                                                )
                                            );
                                            handleToggleCheckedAll(true);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between px-4 mt-4 text-lite">
                                <button
                                    className="w-[150px] h-[48px] bg-error hover:bg-opacity-80 rounded"
                                    onClick={() => handleApprovalMember(0)}
                                >
                                    Từ chối
                                </button>
                                <button
                                    className="w-[150px] h-[48px] bg-primary hover:bg-opacity-80 rounded"
                                    onClick={() => handleApprovalMember(1)}
                                >
                                    Chấp nhận
                                </button>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col px-4 py-2 gap-y-2">
                        {waitingList.map((member) => (
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
                                <div className="flex items-center flex-1">
                                    <span className="mr-auto text-sm font-medium">
                                        {member.full_name}
                                    </span>
                                    <CheckboxSub
                                        name={`chk${member.name}`}
                                        checked={checkedList.includes(
                                            member.user_id
                                        )}
                                        onClick={() => {
                                            if (checkedSingle) {
                                                setCheckedList((prevList) =>
                                                    prevList.filter(
                                                        (memberId) =>
                                                            memberId !==
                                                            member.user_id
                                                    )
                                                );
                                                handleCheckedSingle(false);
                                            } else {
                                                setCheckedList((prevList) => [
                                                    ...prevList,
                                                    member.user_id,
                                                ]);
                                                handleCheckedSingle(true);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoListMember;
