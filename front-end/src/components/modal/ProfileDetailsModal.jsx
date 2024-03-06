import React from "react";
import { useChat } from "../../contexts/chat-context";
import { IconCamera, IconClose, IconEdit } from "../icons";
import Viewer from "react-viewer";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfileModal from "./UpdateProfileModal";
import {
    setShowUpdateAvatar,
    setShowUpdateProfile,
} from "../../store/commonSlice";
import formatPhone from "../../utils/formatPhone";
import ChangeAvatarModal from "./ChangeAvatarModal";
import s3ImageUrl from "../../utils/s3ImageUrl";

const ProfileDetailsModal = () => {
    const { setShowProfileDetails, profileDetailsRef } = useChat();
    const [isOpenAvatar, setIsOpenAvatar] = React.useState(false);
    const [isOpenBG, setIsOpenBG] = React.useState(false);
    const showUpdateProfile = useSelector(
        (state) => state.common.showUpdateProfile
    );
    const showUpdateAvatar = useSelector(
        (state) => state.common.showUpdateAvatar
    );
    const userProfile = useSelector((state) => state.user.userProfile);
    const dispatch = useDispatch();
    const avatar = s3ImageUrl(userProfile.avatar, userProfile._id);
    return (
        <div ref={profileDetailsRef}>
            {!showUpdateProfile && !showUpdateAvatar && (
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
                            src={avatar}
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

                            <button
                                className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-text6 btn_showUpdateAvatar hover:bg-opacity-90"
                                onClick={() =>
                                    dispatch(setShowUpdateAvatar(true))
                                }
                            >
                                <IconCamera />
                            </button>
                        </button>
                        <div className="flex items-start justify-center gap-x-2">
                            <h3 className="text-lg font-medium">
                                {userProfile.nick_name}
                            </h3>
                            <button
                                className="btn-showUpdateProfile"
                                onClick={() =>
                                    dispatch(setShowUpdateProfile(true))
                                }
                            >
                                <IconEdit />
                            </button>
                        </div>
                    </div>
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
                                    {userProfile.gender === 0 ? "Nam" : "Nữ"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-text3">
                                    Ngày sinh
                                </span>
                                <span className="ml-[45px]">
                                    {userProfile.birthday}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-text3">
                                    Điện thoại
                                </span>
                                <span className="ml-10">
                                    {userProfile.phone &&
                                        formatPhone(userProfile.phone)}
                                </span>
                            </div>
                        </div>
                        <p className="mb-2 text-sm font-normal text-text3">
                            Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem
                            được số này
                        </p>
                        <hr />
                        <button
                            className="btn-showUpdateProfile mt-3 px-4 h-[32px] flex items-center justify-center w-full gap-x-2 text-[16px] font-semibold hover:bg-text3 hover:bg-opacity-10"
                            onClick={() => dispatch(setShowUpdateProfile(true))}
                        >
                            <IconEdit />
                            <span>Cập nhật</span>
                        </button>
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
                        images={[{ src: avatar, alt: "" }]}
                    />
                </div>
            )}
            {showUpdateProfile && <UpdateProfileModal />}
            {showUpdateAvatar && <ChangeAvatarModal />}
        </div>
    );
};

export default ProfileDetailsModal;
