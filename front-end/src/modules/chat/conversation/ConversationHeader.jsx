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
import { getUserId } from "../../../utils/auth";
import { setGuestProfile } from "../../../store/userSlice";

const ConversationHeader = ({ name, avatar, userId }) => {
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );
    const currentUserId = getUserId();
    const {
        setShowCreateGroupChat,
        showCreateGroupChat,
        setSelectedList,
        setShowProfileDetails,
        setShowSearchModal,
        setShowSearchMessageModal,
    } = useChat();
    useEffect(() => {
        async function fetchProfileFriendData() {
            try {
                const user = await fetchUserProfile(userId);
                setProfile(user);
            } catch (error) {
                console.log("error", error);
            }
        }
        fetchProfileFriendData();
    }, [dispatch, userId]);

    return (
        <div className="flex items-center justify-center px-4 min-h-[68px] bg-lite shadow-md">
            <div className="flex items-center justify-center mr-auto gap-x-2">
                <div
                    className="w-[48px] h-[48px] rounded-full cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (profile._id !== currentUserId) {
                            dispatch(setProfileType("guest"));
                        }
                        dispatch(setGuestProfile(profile));
                        setShowProfileDetails(true);
                        setShowSearchModal(false);
                    }}
                >
                    <img
                        src={s3ImageUrl(avatar, userId)}
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
                <button
                    className="w-[32px] h-[32px] flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedList([profile]);
                        setShowCreateGroupChat(!showCreateGroupChat);
                    }}
                >
                    <IconAddGroup />
                </button>
                <button className="w-[32px] h-[32px] flex items-center justify-center">
                    <IconPhone />
                </button>
                <button className="w-[32px] h-[32px] flex items-center justify-center">
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
    userId: PropTypes.string,
};

export default ConversationHeader;
