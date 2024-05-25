import { useForm } from "react-hook-form";
import Checkbox, { Toggle } from "../../../../components/checkbox";
import { IconAddGroup, IconCopy, IconKey } from "../../../../components/icons";
import useToggleValue from "../../../../hooks/useToggleValue";
import { axiosPrivate } from "../../../../api/axios";
import { useChat } from "../../../../contexts/chat-context";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsConfirmNewMember,
    setLinkJoinGroup,
} from "../../../../store/conversationSlice";
import { toast } from "react-toastify";
import {
    setShowConversationPermission,
    setShowListMemberInGroup,
} from "../../../../store/commonSlice";
import { WAVE_CHAT_API } from "../../../../api/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";

const InfoGroupSetting = () => {
    const { control } = useForm();
    const dispatch = useDispatch();
    const linkJoinGroup = useSelector(
        (state) => state.conversation.linkJoinGroup
    );
    const isConfirmNewMember = useSelector(
        (state) => state.conversation.isConfirmNewMember
    );
    const waitingList = useSelector((state) => state.conversation.waitingList);
    const { conversationId } = useChat();
    const { value: toggleMonitor, handleToggleValue: handleToggleMonitor } =
        useToggleValue(true);
    const {
        value: toggleReadRecentMessage,
        handleToggleValue: handleToggleReadRecentMessage,
    } = useToggleValue(true);

    const handleMembershipApproval = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.updateConfirmNewMember(conversationId)
            );
            if (res.data.status === 200) {
                dispatch(setIsConfirmNewMember(!isConfirmNewMember));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoinGroupWithLink = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.updateIsJoinWithLink(conversationId)
            );
            if (res.data.status === 200) {
                dispatch(setLinkJoinGroup(res.data.data.link_join));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.disbandGroup(conversationId)
            );
            if (res.data.status === 200) {
                toast.success("Đã giải tán nhóm");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col px-4 py-3 pb-3 text-sm gap-y-3">
                <span className="font-medium">
                    Cho phép các thành viên trong nhóm:
                </span>
                <div className="flex items-center gap-2">
                    <span className="mr-auto">
                        Thay đổi tên & ảnh đại diện của nhóm
                    </span>
                    <Checkbox
                        control={control}
                        type="secondary"
                        name="chkNameGroup"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="mr-auto">
                        Ghim tin nhắn, ghi chú, binh chọn lên đầu hội thoại
                    </span>
                    <Checkbox
                        control={control}
                        type="secondary"
                        name="chkPin"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="mr-auto">Tạo mới ghi chú, nhắc hẹn</span>
                    <Checkbox
                        control={control}
                        type="secondary"
                        name="chkNote"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="mr-auto">Tạo mới binh chọn</span>
                    <Checkbox
                        control={control}
                        type="secondary"
                        name="chkVote"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="mr-auto">Gửi tin nhắn</span>
                    <Checkbox
                        control={control}
                        type="secondary"
                        name="chkMessage"
                    />
                </div>
            </div>
            <div className="flex flex-col px-4 py-3 pt-5 pb-3 border-t-8 gap-y-3 border-text6">
                <Toggle
                    checked={isConfirmNewMember}
                    text="Chế độ phê duyệt thành viên mới"
                    onChange={handleMembershipApproval}
                />
                <Toggle
                    checked={toggleMonitor}
                    text="Đánh dấu tin nhắn từ trưởng/phó nhóm"
                    onChange={() => handleToggleMonitor(!toggleMonitor)}
                />
                <Toggle
                    checked={toggleReadRecentMessage}
                    text="Cho phép thành viên mới đọc tin nhắn gần nhất"
                    onChange={() =>
                        handleToggleReadRecentMessage(!toggleReadRecentMessage)
                    }
                />
                <Toggle
                    checked={linkJoinGroup ? true : false}
                    text=" Cho phép dùng link tham gia nhóm"
                    onChange={handleJoinGroupWithLink}
                />
                <div className="flex items-center justify-between bg-secondary bg-opacity-10 px-3 h-[40px] rounded text-secondary">
                    <span>{linkJoinGroup}</span>
                    <CopyToClipboard
                        text={`https://wavechat.me/g/conversation/${conversationId}?link_join=${linkJoinGroup}`}
                        onCopy={() => toast.success("Đã sao chép")}
                    >
                        <button className="flex items-center justify-center w-8 h-8">
                            <IconCopy />
                        </button>
                    </CopyToClipboard>
                </div>
            </div>
            <div className="flex flex-col border-t-8 gap-y-3 border-text6">
                <button
                    onClick={() => {
                        dispatch(setShowConversationPermission(false));
                        dispatch(setShowListMemberInGroup(true));
                    }}
                    className="px-4 h-[48px] flex items-center justify-start w-full gap-x-3 hover:bg-text6"
                >
                    <IconAddGroup />
                    <span>Danh sách chờ ({waitingList?.length})</span>
                </button>
                <button className="px-4 h-[48px] flex items-center justify-start w-full gap-x-3 hover:bg-text6">
                    <IconKey />
                    <span>Trưởng & Phó nhóm</span>
                </button>
            </div>
            <div className="flex flex-col px-4 py-3 border-t-8 gap-y-3 border-text6">
                <button
                    className="text-center text-red-500 bg-error bg-opacity-20 px-4 h-[32px]"
                    onClick={handleDeleteGroup}
                >
                    Giải tán nhóm
                </button>
            </div>
        </div>
    );
};

export default InfoGroupSetting;
