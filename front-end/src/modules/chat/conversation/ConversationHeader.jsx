import {
    IconAddGroup,
    IconPhone,
    IconSearch,
    IconSplit,
    IconVideoCall,
} from "../../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import { useDispatch, useSelector } from "react-redux";
import {
    setProfileType,
    setShowConversationInfo,
} from "../../../store/commonSlice";
import { useChat } from "../../../contexts/chat-context";
import { useEffect, useState } from "react";
import fetchUserProfile from "../../../api/fetchUserProfile";
import { getUserId, getUserName } from "../../../utils/auth";
import { setGuestProfile } from "../../../store/userSlice";
import { groupAvatarDefault } from "../../../api/constants";
import { useSocket } from "../../../contexts/socket-context";
import DailyIframe from "@daily-co/daily-js";

const ConversationHeader = ({ name, avatar, userId }) => {
    const { socket, setCalledUser, createRoom, deleteRoom } = useSocket();
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);
    const currentUserId = getUserId();
    const currentUserName = getUserName();
    const {
        setShowCreateGroupChat,
        showCreateGroupChat,
        setSelectedList,
        setShowProfileDetails,
        setShowSearchModal,
        setShowSearchMessageModal,
        setShowModalGroupInfo,
    } = useChat();

    const handleVideoCall = async () => {
        try {
            setCalledUser({
                user_id: profile._id,
                full_name: profile.full_name,
                avatar: profile.avatar,
                cover: profile.cover,
            });

            const room = await createRoom();
            const callFrame = DailyIframe.createFrame({
                showFullscreenButton: true,
                iframeStyle: {
                    position: "absolute",
                    width: "700px",
                    height: "400px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                },
            });

            await callFrame.join({
                url: room.url,
                showFullscreenButton: true,
                showLeaveButton: true,
                showParticipantsBar: true,
                userName: currentUserName,
            });

            socket.emit("send-call-request", {
                target_user_id: profile._id,
                signal_data: {
                    type: "video",
                    room_id: room.id,
                    room_url: room.url,
                },
                message: "Gọi video",
            });

            callFrame.on("left-meeting", async () => {
                callFrame.destroy();
            });

            callFrame.on("participant-left", async () => {
                callFrame.destroy();
                // Delete the room on daily.co
                try {
                    await deleteRoom(room.id);
                } catch (error) {
                    console.error(`Failed to delete room: ${error.message}`);
                }
            });
        } catch (error) {
            console.error("Error initiating video call:", error);
            // Xử lý lỗi tạo room hoặc tham gia cuộc gọi
        }
    };
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
        <div className="flex items-center justify-center px-4 min-h-[68px] bg-lite shadow-md">
            <div className="flex items-center justify-center mr-auto gap-x-2">
                <div
                    className="w-[48px] h-[48px] rounded-full cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isGroupChat) {
                            setShowModalGroupInfo(true);
                        } else {
                            if (profile._id !== currentUserId) {
                                dispatch(setProfileType("guest"));
                            }
                            dispatch(setGuestProfile(profile));
                            setShowProfileDetails(true);
                            setShowSearchModal(false);
                        }
                    }}
                >
                    <img
                        src={
                            isGroupChat
                                ? groupAvatarDefault
                                : s3ImageUrl(avatar)
                        }
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <span className="text-sm font-normal text-text3">
                        Truy cập vào{" "}
                        {profile?.last_connect &&
                        profile.last_connect !== "Invalid date"
                            ? profile.last_connect
                            : ""}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2">
                {!isGroupChat && (
                    <button
                        className="w-[32px] h-[32px] flex items-center justify-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedList([
                                {
                                    user_id: profile._id,
                                    full_name: profile.full_name,
                                    avatar: profile.avatar,
                                },
                            ]);
                            setShowCreateGroupChat(!showCreateGroupChat);
                        }}
                    >
                        <IconAddGroup />
                    </button>
                )}
                <button className="w-[32px] h-[32px] flex items-center justify-center">
                    <IconPhone />
                </button>
                <button
                    className="w-[32px] h-[32px] flex items-center justify-center"
                    onClick={handleVideoCall}
                >
                    <IconVideoCall />
                </button>
                <button
                    className="w-[32px] h-[32px] flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSearchMessageModal(true);
                    }}
                >
                    <IconSearch />
                </button>
                <button
                    className={showConversationInfo ? "text-secondary" : ""}
                    onClick={() =>
                        dispatch(setShowConversationInfo(!showConversationInfo))
                    }
                >
                    <IconSplit />
                </button>
            </div>
        </div>
    );
};

ConversationHeader.propTypes = {
    name: PropTypes.string,
    avatar: PropTypes.string,
    userId: PropTypes.any,
};

export default ConversationHeader;
