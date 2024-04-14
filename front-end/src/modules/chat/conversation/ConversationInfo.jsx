import { useDispatch, useSelector } from "react-redux";
import { IconBlock, IconLogout, IconTrash } from "../../../components/icons";
import InfoFile from "./Info/InfoFile";
import InfoHeader from "./Info/InfoHeader";
import InfoImage from "./Info/InfoImage";
import InfoOption from "./Info/InfoOption";
import InfoUser from "./Info/InfoUser";
import PropTypes from "prop-types";
import { groupMessagesByDate } from "../../../utils/groupMessage";
import {
    setActiveConversation,
    setShowConversation,
    setShowConversationInfo,
    setStorageOption,
} from "../../../store/commonSlice";
import { useChat } from "../../../contexts/chat-context";
import { axiosPrivate } from "../../../api/axios";
import { toast } from "react-toastify";
import { setId } from "../../../store/conversationSlice";
import InfoGroupSetting from "./Info/InfoGroupSetting";
import InfoListMember from "./Info/InfoListMember";
import handleLeaveGroup from "../../../utils/handleLeaveGroup";

const ConversationInfo = ({ name, images, files, avatar, userId }) => {
    const showStorage = useSelector((state) => state.common.showStorage);
    const showConversationPermission = useSelector(
        (state) => state.common.showConversationPermission
    );
    const dispatch = useDispatch();
    const storageOption = useSelector((state) => state.common.storageOption);
    const groupImage = groupMessagesByDate(images);
    const groupFile = groupMessagesByDate(files);
    const { conversationId, setShowPassPermissionModal } = useChat();
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);
    const handleDeleteConversation = async () => {
        try {
            const res = await axiosPrivate.post(
                `/conversation/delete?conversation_id=${conversationId}`
            );
            if (res.data.status === 200) {
                dispatch(setShowConversation(false));
                dispatch(setActiveConversation(""));
                dispatch(setShowConversationInfo(false));
                toast.success("Xóa cuộc trò chuyện thành công");
                dispatch(setId(""));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const listMemberOfConversation = useSelector(
        (state) => state.conversation.listMemberOfConversation
    );
    const showListMemberInGroup = useSelector(
        (state) => state.common.showListMemberInGroup
    );
    const handleBlockUser = async () => {
        console.log("block user");
    };

    let headerType = "";

    if (showStorage) headerType = "storage";
    if (showConversationPermission) headerType = "permission";
    if (showListMemberInGroup) headerType = "listMember";
    return (
        <div className="w-[344px] h-screen flex flex-col justify-start bg-lite shadow-md overflow-x-hidden overflow-y-scroll custom-scrollbar">
            <InfoHeader type={headerType} />
            {showStorage && (
                <div>
                    <div className="flex items-center justify-around m-2 mb-5 font-medium">
                        <button
                            className={
                                storageOption === "image"
                                    ? "border-b-2 border-secondary w-[100px]"
                                    : ""
                            }
                            onClick={() => dispatch(setStorageOption("image"))}
                        >
                            Ảnh / Video
                        </button>
                        <button
                            className={
                                storageOption === "file"
                                    ? "border-b-2 border-secondary w-[100px]"
                                    : ""
                            }
                            onClick={() => dispatch(setStorageOption("file"))}
                        >
                            File
                        </button>
                    </div>
                    <div>
                        {storageOption === "image" ? (
                            <InfoImage
                                images={groupImage}
                                type="storage"
                                conversation_id={conversationId}
                            />
                        ) : (
                            <InfoFile
                                files={groupFile}
                                type="storage"
                                conversation_id={conversationId}
                            />
                        )}
                    </div>
                </div>
            )}
            {showConversationPermission && <InfoGroupSetting />}
            {showListMemberInGroup && <InfoListMember />}
            {!showStorage &&
                !showConversationPermission &&
                !showListMemberInGroup && (
                    <div className="flex-1">
                        <InfoUser name={name} avatar={avatar} userId={userId} />
                        {isGroupChat && (
                            <InfoOption
                                number={listMemberOfConversation?.length}
                            />
                        )}
                        <InfoImage
                            images={images}
                            conversation_id={conversationId}
                        />
                        <InfoFile
                            files={files}
                            conversation_id={conversationId}
                        />
                        {!isGroupChat && (
                            <button
                                onClick={handleBlockUser}
                                className="w-full flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 font-medium text-error"
                            >
                                <IconBlock />
                                <span>Chặn người dùng này</span>
                            </button>
                        )}
                        <button
                            onClick={handleDeleteConversation}
                            className="w-full flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 font-medium text-error"
                        >
                            <IconTrash />
                            <span>Xóa lịch sử trò chuyện</span>
                        </button>
                        {isGroupChat && (
                            <button
                                onClick={() =>
                                    handleLeaveGroup(
                                        conversationId,
                                        setShowPassPermissionModal,
                                        isAdmin
                                    )
                                }
                                className="w-full flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 font-medium text-error"
                            >
                                <IconLogout />
                                <span>Rời khỏi nhóm</span>
                            </button>
                        )}
                    </div>
                )}
        </div>
    );
};

ConversationInfo.propTypes = {
    name: PropTypes.string,
    images: PropTypes.array,
    files: PropTypes.array,
    avatar: PropTypes.string,
    userId: PropTypes.any,
    conversation_id: PropTypes.string,
};

export default ConversationInfo;
