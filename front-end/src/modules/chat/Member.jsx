import { useState } from "react";
import { IconHorizontalMore } from "../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../utils/auth";
import { setActiveName, setShowConversation } from "../../store/commonSlice";
import { setFriendInfo } from "../../store/userSlice";
import { useChat } from "../../contexts/chat-context";

const Member = ({ user }) => {
    const [isHover, setIsHover] = useState(false);
    const current_userId = getUserId();
    const dispatch = useDispatch();
    const checkMemberInConversation = user.members.find(
        (member) => member._id === current_userId
    );
    const activeName = useSelector((state) => state.common.activeName);
    const { setConversationId } = useChat();
    if (!user || !checkMemberInConversation) return null;
    const otherUser = user.members.find(
        (member) => member._id !== current_userId
    );
    const isActive = otherUser.full_name === activeName;

    const handleClickedMember = () => {
        dispatch(setFriendInfo(otherUser));
        dispatch(setShowConversation(true));
        dispatch(setActiveName(otherUser.full_name));
        setConversationId("");
    };

    return (
        <div
            className={`flex items-center gap-x-2 min-h-[74px] h-full w-full cursor-pointer ${
                isActive ? "bg-tertiary" : "hover:bg-text4 hover:bg-opacity-10 "
            }`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleClickedMember}
        >
            <div className="flex items-center justify-center gap-x-3">
                <div className="w-[48px] h-[48px] rounded-full ml-2">
                    <img
                        src={s3ImageUrl(otherUser.avatar, otherUser._id)}
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">
                        {otherUser.full_name}
                    </span>
                    <span className="text-sm text-text3">Hello</span>
                </div>
            </div>
            <div className="pb-3 pr-3 ml-auto">
                {isHover ? (
                    <IconHorizontalMore />
                ) : (
                    <span className="text-sm">3 giờ</span>
                )}
            </div>
        </div>
    );
};

Member.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Member;
