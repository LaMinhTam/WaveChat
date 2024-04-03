import React, { useEffect } from "react";
import { useChat } from "../../contexts/chat-context";
import { IconCamera, IconClose, IconEdit } from "../icons";
import Viewer from "react-viewer";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfileModal from "./UpdateProfileModal";
import {
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

const ProfileDetailsModal = () => {
    // 0 - Nhắn tin | 1 - Kết bạn | 2 - Thu hồi | 3 - Chấp nhận
    const dispatch = useDispatch();
    const { setShowProfileDetails, profileDetailsRef } = useChat();
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
            ? [
                  s3ImageUrl(userProfile?.avatar, userProfile?._id),
                  s3ImageUrl(userProfile?.cover, userProfile?._id),
              ]
            : [
                  s3ImageUrl(guestProfile?.avatar, guestProfile?._id),
                  s3ImageUrl(guestProfile?.cover, guestProfile?._id),
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
            console.log("useEffect ~ friendRequest:", friendRequest);
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

    const handFriendRequest = async () => {
        if (status === 0) {
            console.log("Chat with friend");
        } else if (status === 1) {
            const res = await axiosPrivate.post(
                `/friend/send?_id=${data?._id}`
            );
            if (res.data.status === 200) {
                toast.success("Đã gửi lời mời kết bạn");
                dispatch(setRender(Math.random()));
                setStatus(2);
            } else {
                toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
                setStatus(1);
            }
        } else if (status === 2) {
            try {
                const res = await axiosPrivate.post(
                    `/friend/remove-request?_id=${data?._id}`
                );
                console.log("handFriendRequest ~ res:", res);
                if (res.data.status === 200) {
                    dispatch(setRender(Math.random()));
                    setStatus(1);
                    toast.success("Đã thu hồi lời mời kết bạn");
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi");
                setStatus(2);
            }
        } else if (status === 3) {
            try {
                const res = await axiosPrivate.post(
                    `/friend/accept?_id=${data?._id}`
                );
                if (res.data.status === 200) {
                    const response = await axiosPrivate.post(
                        "/conversation/create",
                        {
                            member_id: data?._id,
                        }
                    );
                    if (response.data.status === 200) {
                        dispatch(setRender(Math.random()));
                        toast.success("Hai bạn đã trở thành bạn bè");
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
                                            Change avatar
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
                                            Change cover
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
                        <button
                            className="px-4 py-2 bg-secondary text-lite"
                            onClick={handFriendRequest}
                        >
                            {status === 0 && "Nhắn tin"}
                            {status === 1 && "Kết bạn"}
                            {status === 2 && "Thu hồi"}
                            {status === 3 && "Chấp nhận"}
                        </button>
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
