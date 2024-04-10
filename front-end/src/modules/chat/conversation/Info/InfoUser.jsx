import {
    IconAddGroup,
    IconAddUser,
    IconBell,
    IconCheck,
    IconEdit,
    IconPin,
} from "../../../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../../../utils/s3ImageUrl";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useChat } from "../../../../contexts/chat-context";
import fetchUserProfile from "../../../../api/fetchUserProfile";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../../../api/axios";
import { setId } from "../../../../store/conversationSlice";
import { useSelector } from "react-redux";

const InfoUser = ({ name, avatar, userId }) => {
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();
    const {
        setShowCreateGroupChat,
        showCreateGroupChat,
        setSelectedList,
        conversationId,
    } = useChat();
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);
    const [isEdited, setIsEdited] = useState(false);
    const [newName, setNewName] = useState(name);
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
    const handleChangeConversationName = async () => {
        try {
            const res = await axiosPrivate.post(
                `/conversation/update-name?conversation_id=${conversationId}`,
                {
                    name: newName,
                }
            );
            if (res.data.status === 200) {
                dispatch(setId(Math.random() * 1000));
                setIsEdited(false);
                toast.success("Đổi tên thành công");
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
    };
    return (
        <div className="flex flex-col items-center px-4 py-3 border-b-8">
            <div className="my-3 rounded-full w-14 h-14">
                <img
                    src={s3ImageUrl(avatar, userId)}
                    alt=""
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex items-center justify-center">
                <input
                    type="text"
                    className={`${
                        isGroupChat ? "w-full" : "w-[150px]"
                    } h-8 text-lg font-medium bg-transparent border-none text-text1`}
                    onChange={(e) => setNewName(e.target.value)}
                    value={newName}
                    disabled={!isEdited}
                />
                <div className="flex items-center justify-center gap-x-2">
                    <button
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-text6"
                        onClick={() => setIsEdited(!isEdited)}
                    >
                        <span className="flex items-center justify-center w-4 h-4">
                            <IconEdit />
                        </span>
                    </button>
                    {isEdited && (
                        <button
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-text6"
                            onClick={handleChangeConversationName}
                            disabled={name === newName}
                        >
                            <span className="flex items-center justify-center w-4 h-4">
                                <IconCheck />
                            </span>
                        </button>
                    )}
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
                        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
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
            </div>
        </div>
    );
};

InfoUser.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    userId: PropTypes.string,
};

export default InfoUser;
