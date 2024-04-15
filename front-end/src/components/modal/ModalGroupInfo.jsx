import { useDispatch, useSelector } from "react-redux";
import { groupAvatarDefault } from "../../api/constants";
import { useChat } from "../../contexts/chat-context";
import { IconClose, IconCopy } from "../icons";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import {
    setShowConversationInfo,
    setShowListMemberInGroup,
} from "../../store/commonSlice";

const ModalGroupInfo = () => {
    const { setShowModalGroupInfo, modalGroupInfoRef } = useChat();
    const { conversationDetails } = useChat();
    const linkJoinGroup = useSelector(
        (state) => state.conversation.linkJoinGroup
    );
    const dispatch = useDispatch();
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );
    const handleCopyLink = () => {
        let link = "";

        if (linkJoinGroup) {
            link = `wavechat.me/g/conversation/${conversationDetails.conversation_id}?link_join=${linkJoinGroup}`;
        }
        link = "https://" + link;
        navigator.clipboard.writeText(link);
        toast.success("Đã sao chép");
    };
    const handleViewMember = () => {
        setShowModalGroupInfo(false);
        if (showConversationInfo) {
            dispatch(setShowListMemberInGroup(true));
        } else {
            dispatch(setShowConversationInfo(true));
            dispatch(setShowListMemberInGroup(true));
        }
    };
    return (
        <div ref={modalGroupInfoRef}>
            <div className="w-[400px] h-full p-2 flex flex-col">
                <div className="flex items-center w-full h-[48px]">
                    <span className="text-[16px] font-semibold mr-auto">
                        Thông tin nhóm
                    </span>
                    <button
                        onClick={() => setShowModalGroupInfo(false)}
                        className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10"
                    >
                        <IconClose />
                    </button>
                </div>
                <div className="flex items-center justify-start pb-2 border-b-8 gap-x-10">
                    <div className="w-20 h-20 rounded-full">
                        <img
                            src={groupAvatarDefault}
                            alt=""
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                    <span>{conversationDetails?.name}</span>
                </div>
                <button
                    className="w-full h-[48px] text-center hover:bg-text6 mt-3"
                    onClick={handleViewMember}
                >
                    Danh sách thành viên ({conversationDetails?.members?.length}
                    )
                </button>
                <span className="mt-2 text-sm font-normal text-text7">
                    Link tham gia nhóm
                </span>
                <div className="flex items-center justify-between bg-secondary bg-opacity-10 px-3 h-[40px] rounded text-secondary">
                    <span>{linkJoinGroup}</span>
                    <button
                        className="flex items-center justify-center w-8 h-8"
                        onClick={handleCopyLink}
                    >
                        <IconCopy />
                    </button>
                </div>
                <div className="flex flex-col items-start justify-center mt-2 gap-y-3">
                    <span className="mt-2 text-sm font-normal text-text7">
                        Mã QR tham gia nhóm
                    </span>
                    {linkJoinGroup && (
                        <QRCode value={linkJoinGroup} size={200} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalGroupInfo;
