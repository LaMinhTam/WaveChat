import React, { useEffect } from "react";
import { useChat } from "../../contexts/chat-context";
import { IconCamera, IconClose, IconEdit } from "../icons";
import Viewer from "react-viewer";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfileModal from "./UpdateProfileModal";
import {
    setShowConversation,
    setShowUpdateAvatar,
    setShowUpdateCover,
    setShowUpdateProfile,
} from "../../store/commonSlice";
import formatPhone from "../../utils/formatPhone";
import ChangeImageModal from "./ChangeImageModal";
import s3ImageUrl from "../../utils/s3ImageUrl";
import useClickOutSide from "../../hooks/useClickOutSide";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { setRender } from "../../store/friendSlice";
import { setId } from "../../store/conversationSlice";
import { WAVE_CHAT_API } from "../../api/constants";

const ProfileDetailsModal = () => {
    // 0 - Nhắn tin | 1 - Kết bạn | 2 - Thu hồi | 3 - Chấp nhận
    const dispatch = useDispatch();
    const {
        setShowProfileDetails,
        profileDetailsRef,
        setRenderBlock,
        isBlocked,
        setIsBlocked,
    } = useChat();
    const {
        show: showOption,
        setShow: setShowOption,
        nodeRef: showOptionRef,
    } = useClickOutSide("button");
    const [isOpenAvatar, setIsOpenAvatar] = React.useState(false);
    const [status, setStatus] = React.useState(0);
    const [isOpenBG, setIsOpenBG] = React.useState(false);
    const listFriend = useSelector((state) => state.user.listFriend);
    const listFriendRequest = useSelector(
        (state) => state.friend.listFriendRequest
    );
    const listFriendSendRequest = useSelector(
        (state) => state.friend.listFriendSendRequest
    );

    const showUpdateProfile = useSelector(
        (state) => state.common.showUpdateProfile
    );
    const showUpdateAvatar = useSelector(
        (state) => state.common.showUpdateAvatar
    );
    const showUpdateCover = useSelector(
        (state) => state.common.showUpdateCover
    );
    const profileType = useSelector((state) => state.common.profileType);
    const userProfile = useSelector((state) => state.user.userProfile);
    const guestProfile = useSelector((state) => state.user.guestProfile);
    const [avatar, cover] =
        profileType === "currentUser"
            ? [s3ImageUrl(userProfile?.avatar), s3ImageUrl(userProfile?.cover)]
            : [
                  s3ImageUrl(guestProfile?.avatar),
                  s3ImageUrl(guestProfile?.cover),
              ];

    const [data, setData] = React.useState({});

    useEffect(() => {
        if (profileType === "currentUser") {
            setData(userProfile);
        } else if (profileType === "guest") {
            setData(guestProfile);
        } else {
            setData({});
        }
    }, [guestProfile, profileType, userProfile]);

    useEffect(() => {
        const friend = listFriend?.find((item) => item.user_id === data?._id);
        if (friend) {
            setStatus(0);
        } else {
            const friendRequest = listFriendRequest?.find(
                (item) => item.user_id === data?._id
            );
            if (friendRequest) {
                setStatus(3);
            } else {
                const friendSendRequest = listFriendSendRequest?.find(
                    (item) => item.user_id === data?._id
                );
                if (friendSendRequest) {
                    setStatus(2);
                } else {
                    setStatus(1);
                }
            }
        }
    }, [data, listFriend, listFriendRequest, listFriendSendRequest]);

    const handleRemoveFriend = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.removeFriend(data?._id)
            );
            if (res.data.status === 200) {
                dispatch(setRender(Math.random() * 1000));
                dispatch(setId(Math.random() * 1000));
                dispatch(setShowConversation(false));
                toast.success(`Đã hủy kết bạn với ${data?.full_name}`);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        }
    };

    const handleBlockUser = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.blockUser(data?._id)
            );
            if (res.data.status === 200) {
                setIsBlocked(true);
                setRenderBlock(Math.random() * 1000);
                toast.success("Đã chặn người dùng");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
            console.log(error);
        }
    };

    const handleUnBlockUser = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.removeBlockUser(data?._id)
            );
            if (res.data.status === 200) {
                setIsBlocked(false);
                setRenderBlock(Math.random() * 1000);
                toast.success("Đã bỏ chặn người dùng");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
            console.log(error);
        }
    };

    const handFriendRequest = async () => {
        if (status === 0) {
            await handleRemoveFriend();
        } else if (status === 1) {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.sendFriendRequest(data?._id)
            );
            if (res.data.status === 200) {
                toast.success("Đã gửi lời mời kết bạn");
                dispatch(setRender(Math.random() * 1000));
                setStatus(2);
            } else {
                toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
                setStatus(1);
            }
        } else if (status === 2) {
            try {
                const res = await axiosPrivate.post(
                    WAVE_CHAT_API.recallSentRequest(data?._id)
                );
                if (res.data.status === 200) {
                    toast.success("Đã thu hồi lời mời kết bạn");
                    dispatch(setRender(Math.random() * 1000));
                    setStatus(1);
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi");
                setStatus(2);
            }
        } else if (status === 3) {
            try {
                const res = await axiosPrivate.post(
                    WAVE_CHAT_API.acceptFriendRequest(data?._id)
                );
                if (res.data.status === 200) {
                    const response = await axiosPrivate.post(
                        WAVE_CHAT_API.createConversation(),
                        {
                            member_id: data?._id,
                        }
                    );
                    if (response.data.status === 200) {
                        toast.success("Hai bạn đã trở thành bạn bè");
                        dispatch(setRender(Math.random() * 1000));
                        setStatus(0);
                    }
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi");
                setStatus(3);
            }
        }
    };
    return (
        <div ref={profileDetailsRef}>
            {!showUpdateProfile && !showUpdateAvatar && !showUpdateCover && (
                <div className="w-[400px] h-full p-2 flex flex-col">
                    <div className="flex items-center w-full h-[48px]">
                        <span className="text-[16px] font-semibold mr-auto">
                            Thông tin tài khoản
                        </span>
                        <button
                            onClick={() => setShowProfileDetails(false)}
                            className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10"
                        >
                            <IconClose />
                        </button>
                    </div>
                    <div
                        className="w-full h-[171px] cursor-pointer"
                        onClick={() => {
                            setIsOpenBG(true);
                        }}
                    >
                        <img
                            src={cover}
                            alt=""
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex items-center translate-y-[-0.75rem] gap-x-5">
                        <button className="relative w-20 h-20 ml-5 rounded-full">
                            <img
                                src={avatar}
                                alt=""
                                className="object-cover w-full h-full rounded-full"
                                onClick={() => {
                                    setIsOpenAvatar(true);
                                }}
                            />

                            {profileType === "currentUser" && (
                                <button
                                    className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-text6 btn_showUpdateAvatar hover:bg-opacity-90"
                                    onClick={() => setShowOption(true)}
                                >
                                    <IconCamera />
                                </button>
                            )}
                        </button>
                        {profileType === "currentUser" && (
                            <div className="absolute z-[9999] left-[105px] bottom-0">
                                {showOption && (
                                    <div
                                        className="flex flex-col items-center text-sm bg-lite"
                                        ref={showOptionRef}
                                    >
                                        <button
                                            className="px-4 py-2 hover:bg-primary hover:text-lite"
                                            onClick={() => {
                                                setShowOption(false);
                                                dispatch(
                                                    setShowUpdateAvatar(true)
                                                );
                                            }}
                                        >
                                            Cập nhật ảnh đại diện
                                        </button>
                                        <button
                                            className="px-4 py-2 hover:bg-primary hover:text-lite"
                                            onClick={() => {
                                                setShowOption(false);
                                                dispatch(
                                                    setShowUpdateCover(true)
                                                );
                                            }}
                                        >
                                            Cập nhật ảnh bìa
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-start justify-center gap-x-2">
                            <h3 className="text-lg font-medium">
                                {data?.nick_name}
                            </h3>
                            {profileType === "currentUser" && (
                                <button
                                    className="btn-showUpdateProfile"
                                    onClick={() =>
                                        dispatch(setShowUpdateProfile(true))
                                    }
                                >
                                    <IconEdit />
                                </button>
                            )}
                        </div>
                    </div>
                    {profileType === "guest" && (
                        <div className="flex items-center justify-center w-full h-full mb-2 gap-x-5">
                            {!isBlocked ? (
                                <button
                                    className="px-4 py-2 bg-error text-lite w-[150px] h-full"
                                    onClick={handleBlockUser}
                                >
                                    Chặn
                                </button>
                            ) : (
                                <button
                                    className="px-4 py-2 bg-error text-lite w-[150px] h-full"
                                    onClick={handleUnBlockUser}
                                >
                                    Bỏ chặn
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-secondary text-lite w-[150px] h-full"
                                onClick={handFriendRequest}
                            >
                                {status === 0 && "Hủy kết bạn"}
                                {status === 1 && "Kết bạn"}
                                {status === 2 && "Thu hồi"}
                                {status === 3 && "Chấp nhận"}
                            </button>
                        </div>
                    )}
                    <hr className="w-full h-1 bg-text6" />
                    <div className="py-3">
                        <h4 className="font-semibold text-[16px]">
                            Thông tin cá nhân
                        </h4>
                        <div className="flex flex-col items-start justify-center mt-2 mb-3 gap-y-2">
                            <div className="flex items-center">
                                <span className="text-sm text-text3">
                                    Giới tính
                                </span>
                                <span className="ml-[56px]">
                                    {data?.gender === 0 ? "Nam" : "Nữ"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-text3">
                                    Ngày sinh
                                </span>
                                <span className="ml-[45px]">
                                    {data?.birthday}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-text3">
                                    Điện thoại
                                </span>
                                <span className="ml-10">
                                    {data?.phone && formatPhone(data?.phone)}
                                </span>
                            </div>
                        </div>
                        <p className="mb-2 text-sm font-normal text-text3">
                            Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem
                            được số này
                        </p>
                        <hr />
                        {profileType === "currentUser" && (
                            <button
                                className="btn-showUpdateProfile mt-3 px-4 h-[32px] flex items-center justify-center w-full gap-x-2 text-[16px] font-semibold hover:bg-text3 hover:bg-opacity-10"
                                onClick={() =>
                                    dispatch(setShowUpdateProfile(true))
                                }
                            >
                                <IconEdit />
                                <span>Cập nhật</span>
                            </button>
                        )}
                    </div>
                    <Viewer
                        visible={isOpenAvatar}
                        onClose={() => {
                            setIsOpenAvatar(false);
                        }}
                        images={[{ src: avatar, alt: "" }]}
                    />
                    <Viewer
                        visible={isOpenBG}
                        onClose={() => {
                            setIsOpenBG(false);
                        }}
                        images={[{ src: cover, alt: "" }]}
                    />
                </div>
            )}
            {showUpdateProfile && <UpdateProfileModal />}
            {showUpdateAvatar && <ChangeImageModal type="avatar" />}
            {showUpdateCover && <ChangeImageModal type="cover" />}
        </div>
    );
};

export default ProfileDetailsModal;
