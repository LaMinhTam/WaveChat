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
} from "../../store/commonSlice";
import { setFriendInfo } from "../../store/userSlice";
import formatTime from "../../utils/formatTime";
import { axiosPrivate } from "../../api/axios";
import { useChat } from "../../contexts/chat-context";

const Member = ({ user }) => {
    // console.log("Member ~ user:", user);
    const [isHover, setIsHover] = useState(false);
    const [incomingClassName, setIncomingClassName] = useState("");
    const { setMessage, setConversationId } = useChat();
    const current_userId = getUserId();
    const dispatch = useDispatch();
    const activeConversation = useSelector(
        (state) => state.common.activeConversation
    );
    const incomingMessageOfConversation = useSelector(
        (state) => state.common.incomingMessageOfConversation
    );
    let otherUserId = null;
    if (user.type === 2) {
        otherUserId = user.members.find((member) => member !== current_userId);
    }

    const otherUserInfo = {
        _id: user.conversation_id ? otherUserId : user.user_id,
        avatar: user.avatar,
        full_name: user.conversation_id ? user.name : user.full_name,
    };

    // const isActive = activeConversation === user._id;
    let isActive = false;
    if (activeConversation === user._id) {
        isActive = true;
    } else if (activeConversation === user.user_id) {
        isActive = true;
    } else {
        isActive = false;
    }

    const handleClickedMember = async () => {
        try {
            const res = await axiosPrivate.get(`/message/${user._id}`);
            const data = res.data.data;
            if (data) {
                data.reverse();
                setMessage(data);
            } else {
                setMessage([]);
            }
            setIncomingClassName("");
            dispatch(setIncomingMessageOfConversation(""));
            if (user._id) {
                dispatch(setActiveConversation(user._id));
            } else {
                dispatch(setActiveConversation(user.user_id));
            }
            dispatch(setFriendInfo(otherUserInfo));
            dispatch(setShowConversation(true));
            setConversationId(user.conversation_id);
        } catch (error) {
            console.log(error);
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
    if (!user) return null;

    return (
        <div
            className={`flex items-center gap-x-2 min-h-[74px] h-full w-full cursor-pointer ${
                isActive ? "bg-tertiary" : "hover:bg-text4 hover:bg-opacity-10 "
            } ${incomingClassName}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleClickedMember}
        >
            <div className="flex items-center justify-center gap-x-3">
                <div className="w-[48px] h-[48px] rounded-full ml-2 flex-shrink-0">
                    <img
                        src={s3ImageUrl(
                            otherUserInfo?.avatar,
                            otherUserInfo?._id
                        )}
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">
                        {otherUserInfo?.full_name}
                    </span>
                    <span className="text-sm text-text3 line-clamp-1">
                        {lastMessage?.message}
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
                {incomingClassName && <span className="ml-2">🔴</span>}
            </div>
        </div>
    );
};

Member.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Member;
