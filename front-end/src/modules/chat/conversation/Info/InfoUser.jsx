import {
    IconAddGroup,
    IconAddUser,
    IconBell,
    IconEdit,
    IconPin,
    IconSetting,
} from "../../../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../../../utils/s3ImageUrl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useChat } from "../../../../contexts/chat-context";
import fetchUserProfile from "../../../../api/fetchUserProfile";
import { useSelector } from "react-redux";
import { setShowConversationPermission } from "../../../../store/commonSlice";
import { groupAvatarDefault } from "../../../../api/constants";

const InfoUser = ({ name, avatar, userId }) => {
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();
    const {
        setShowCreateGroupChat,
        showCreateGroupChat,
        setSelectedList,
        setShowAddMemberModal,
        setShowModalChangeGroupName,
    } = useChat();
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);
    const isAdmin = useSelector((state) => state.conversation.isAdmin);
    useEffect(() => {
        async function fetchProfileFriendData() {
            try {
                const user = await fetchUserProfile(userId);
                setProfile(user);
            } catch (error) {
                console.log("error", error);
            }
        }
        if (!isGroupChat) {
            fetchProfileFriendData();
        } else {
            setProfile({});
        }
    }, [dispatch, isGroupChat, userId]);
    return (
        <div className="flex flex-col items-center px-4 py-3 border-b-8">
            <div className="my-3 rounded-full w-14 h-14">
                <img
                    src={isGroupChat ? groupAvatarDefault : s3ImageUrl(avatar)}
                    alt=""
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex items-center justify-center">
                <span className="mr-2 text-lg font-medium">{name}</span>
                <div className="flex items-center justify-center gap-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowModalChangeGroupName(true);
                        }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-text6"
                    >
                        <span className="flex items-center justify-center w-4 h-4">
                            <IconEdit />
                        </span>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-center w-[310px] h-[90px] pt-3">
                <div className="flex flex-col items-center">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
                        <span className="flex items-center justify-center w-5 h-5">
                            <IconBell />
                        </span>
                    </button>
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        Tắt thông báo
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
                        <span className="flex items-center justify-center w-5 h-5">
                            <IconPin />
                        </span>
                    </button>
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        Ghim hội thoại
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    {isGroupChat ? (
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-text6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAddMemberModal(true);
                            }}
                        >
                            <span className="flex items-center justify-center w-5 h-5">
                                <IconAddUser />
                            </span>
                        </button>
                    ) : (
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-text6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedList([profile]);
                                setShowCreateGroupChat(!showCreateGroupChat);
                            }}
                        >
                            <span className="flex items-center justify-center w-5 h-5">
                                <IconAddGroup />
                            </span>
                        </button>
                    )}
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        {isGroupChat
                            ? "Thêm thành viên"
                            : "Tạo nhóm trò chuyện"}
                    </span>
                </div>
                {isAdmin && isGroupChat && (
                    <div className="flex flex-col items-center">
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-text6"
                            onClick={() =>
                                dispatch(setShowConversationPermission(true))
                            }
                        >
                            <span className="flex items-center justify-center w-5 h-5">
                                <IconSetting />
                            </span>
                        </button>
                        <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                            Quản lý nhóm
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

InfoUser.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    userId: PropTypes.any,
};

export default InfoUser;
