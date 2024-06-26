import { useEffect, useState } from "react";
import { IconHorizontalMore } from "../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../utils/auth";
import {
    setActiveConversation,
    setIncomingMessageOfConversation,
    setShowConversation,
    setShowConversationInfo,
} from "../../store/commonSlice";
import { setFriendInfo } from "../../store/userSlice";
import formatTime from "../../utils/formatTime";
import { useChat } from "../../contexts/chat-context";
import { useSocket } from "../../contexts/socket-context";
import { axiosPrivate } from "../../api/axios";
import {
    setIsGroupChat,
    setLinkJoinGroup,
} from "../../store/conversationSlice";
import {
    CONVERSATION_TYPE,
    WAVE_CHAT_API,
    groupAvatarDefault,
} from "../../api/constants";

const Member = ({ user }) => {
    const [isHover, setIsHover] = useState(false);
    const [incomingClassName, setIncomingClassName] = useState("");
    const { setConversationId, setBlockType, renderBlock, conversationId } =
        useChat();
    const { unreadCount, setUnreadCount } = useSocket();
    const current_userId = getUserId();
    const dispatch = useDispatch();
    const activeConversation = useSelector(
        (state) => state.common.activeConversation
    );
    const incomingMessageOfConversation = useSelector(
        (state) => state.common.incomingMessageOfConversation
    );
    let otherUserId = null;
    if (user.type === CONVERSATION_TYPE.PERSONAL) {
        otherUserId = user.members.find((member) => member !== current_userId);
    } else if (user.type === CONVERSATION_TYPE.GROUP) {
        otherUserId = user.members.filter(
            (member) => member !== current_userId
        );
    }

    const otherUserInfo = {
        _id: user._id ? otherUserId : user.user_id,
        avatar: user.avatar,
        full_name: user._id ? user.name : user.full_name,
    };

    let isActive = false;
    if (activeConversation === user._id) {
        isActive = true;
    } else if (activeConversation === user.user_id) {
        isActive = true;
    } else {
        isActive = false;
    }

    useEffect(() => {
        async function fetchBlockType() {
            try {
                const resDetails = await axiosPrivate.get(
                    WAVE_CHAT_API.conversationDetail(user._id)
                );
                if (resDetails.data.status === 200) {
                    let block_type = resDetails.data.data.block_type;
                    setBlockType(block_type);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (renderBlock) {
            fetchBlockType();
        }
    }, [renderBlock, setBlockType, user._id]);

    const handleClickedMember = async () => {
        if (conversationId !== user._id) {
            setIncomingClassName("");
            dispatch(setIncomingMessageOfConversation(""));
            setUnreadCount(0);
            if (user._id) {
                dispatch(setActiveConversation(user._id));
            } else {
                dispatch(setActiveConversation(user.user_id));
            }
            dispatch(setFriendInfo(otherUserInfo));
            dispatch(setLinkJoinGroup(user?.link_join || ""));
            dispatch(setIsGroupChat(user.type === 1 ? true : false));
            dispatch(setShowConversation(true));
            setConversationId(user._id);
            dispatch(setShowConversationInfo(false));
        }
    };
    useEffect(() => {
        const conversation_id = incomingMessageOfConversation.split("_")[0];
        if (conversation_id === user._id && isActive === false) {
            setIncomingClassName("bg-error bg-opacity-10");
        } else {
            setIncomingClassName("");
        }
    }, [incomingMessageOfConversation, isActive, user._id]);

    const lastMessage = user.last_message;
    const handleLastMessage = (msg) => {
        let message = "";
        if (msg?.type === 14) {
            message = "Tin nhắn đã thu hồi";
        } else if (msg?.type === 1 || msg?.type === 16) {
            message = msg.message;
        } else if (msg?.type === 2) {
            message = "Hình ảnh";
        } else if (msg?.type === 3) {
            message = "video";
        } else if (msg?.type === 5) {
            message = "Tệp tin";
        } else {
            message = "";
        }
        return message;
    };
    if (!user) return null;

    return (
        <div
            className={`flex items-center gap-x-2 min-h-[74px] h-full w-full max-w-[344px] cursor-pointer ${
                isActive ? "bg-tertiary" : "hover:bg-text4 hover:bg-opacity-10 "
            } ${incomingClassName}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleClickedMember}
        >
            <div className="flex items-center justify-center gap-x-3">
                <div className="w-[48px] h-[48px] rounded-full ml-2 flex-shrink-0">
                    <img
                        src={
                            user.type === CONVERSATION_TYPE.GROUP
                                ? groupAvatarDefault
                                : s3ImageUrl(user.avatar)
                        }
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div className="flex flex-col w-full max-w-[200px]">
                    <span className="text-sm font-bold">
                        {otherUserInfo?.full_name}
                    </span>
                    <span className="text-sm text-text3 line-clamp-1">
                        {handleLastMessage(lastMessage)}
                    </span>
                </div>
            </div>
            <div className="flex-shrink-0 pb-3 pr-3 ml-auto">
                {isHover ? (
                    <IconHorizontalMore />
                ) : (
                    <span className="text-sm">
                        {user._id &&
                            formatTime(
                                lastMessage?.updated_at || user?.updated_at
                            )}
                    </span>
                )}
            </div>

            {incomingClassName && (
                <div className="flex items-center justify-center w-6 h-6 ml-2 mr-2 bg-red-600 rounded-full text-lite">
                    <span>{unreadCount}</span>
                </div>
            )}
        </div>
    );
};

Member.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Member;
