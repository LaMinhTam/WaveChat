import useS3Image from "../../hooks/useS3Image";
import { IconBack, IconClose } from "../icons";
import ImageUpload from "../image/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
    setShowUpdateAvatar,
    setShowUpdateCover,
    setShowUpdateProfile,
} from "../../store/commonSlice";
import { useChat } from "../../contexts/chat-context";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import { setUserProfile } from "../../store/userSlice";
import s3ImageUrl from "../../utils/s3ImageUrl";
import PropTypes from "prop-types";
import { WAVE_CHAT_API } from "../../api/constants";

const ChangeImageModal = ({ type }) => {
    const { progress, image, handleSelectImage, setImage, handleResetUpload } =
        useS3Image();

    const dispatch = useDispatch();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const userProfile = useSelector((state) => state.user.userProfile);

    useEffect(() => {
        if (type === "avatar") {
            setIsButtonDisabled(!image || image === userProfile.avatar);
        } else if (type === "cover") {
            setIsButtonDisabled(!image || image === userProfile.cover);
        } else if (!image) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [image, type, userProfile.avatar, userProfile.cover]);

    useEffect(() => {
        if (type === "avatar" && userProfile.avatar) {
            setImage(s3ImageUrl(userProfile.avatar));
        } else if (type === "cover" && userProfile.cover) {
            setImage(s3ImageUrl(userProfile.cover));
        }
    }, [
        setImage,
        type,
        userProfile._id,
        userProfile.avatar,
        userProfile.cover,
    ]);

    const { setShowProfileDetails } = useChat();
    const handleUpdateAvatar = async () => {
        if (!image) {
            setIsButtonDisabled(true);
            return;
        }
        try {
            let avatar = "";
            let cover = "";

            if (type === "avatar") {
                avatar = image;
                cover = userProfile.cover;
            }
            if (type === "cover") {
                avatar = userProfile.avatar;
                cover = image;
            }

            const res = await axiosPrivate.post(WAVE_CHAT_API.updateProfile(), {
                ...userProfile,
                avatar,
                cover,
            });
            if (res.data.status === 200) {
                toast.success(
                    `Cập nhật ${
                        type === "avatar" ? "ảnh đại diện" : "ảnh bìa"
                    } thành công`
                );
                dispatch(setUserProfile(res.data.data));
                dispatch(setShowUpdateProfile(false));
                dispatch(setShowUpdateAvatar(false));
                dispatch(setShowUpdateCover(false));
                setShowProfileDetails(false);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(
                `Cập nhật ${
                    type === "avatar" ? "ảnh đại diện" : "ảnh bìa"
                } thất bại vui lòng thử lại sau`
            );
        }
    };
    return (
        <div className="w-[400px] h-full flex flex-col">
            <div className="flex items-center w-full h-[48px]">
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 mr-2 rounded-full btn_backToProfileDetails hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        dispatch(setShowUpdateProfile(false));
                        if (type === "avatar") {
                            dispatch(setShowUpdateAvatar(false));
                        } else {
                            dispatch(setShowUpdateCover(false));
                        }
                    }}
                >
                    <IconBack />
                </button>
                <span className="text-[16px] font-semibold mr-auto">
                    Cập nhật ảnh {type === "avatar" ? "đại diện" : "bìa"}
                </span>
                <button
                    onClick={() => {
                        dispatch(setShowUpdateProfile(false));
                        setShowProfileDetails(false);
                        if (type === "avatar") {
                            dispatch(setShowUpdateAvatar(false));
                        } else {
                            dispatch(setShowUpdateCover(false));
                        }
                    }}
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                >
                    <IconClose />
                </button>
            </div>
            <hr className="w-full h-[1px] bg-text6" />
            <div>
                <div className="w-full px-4 mt-2 mb-6">
                    <button className="w-full">
                        <ImageUpload
                            name="image"
                            onChange={handleSelectImage}
                            progress={progress}
                            image={image}
                            className="h-[250px]"
                            handleDeleteImage={() => handleResetUpload(type)}
                            required
                        ></ImageUpload>
                    </button>
                    <div className="flex items-center justify-center w-full px-4 py-2">
                        <div className="flex items-center justify-center ml-auto gap-x-2">
                            <button
                                onClick={() => {
                                    dispatch(setShowUpdateProfile(false));
                                    dispatch(setShowUpdateAvatar(false));
                                    dispatch(setShowUpdateCover(false));
                                }}
                                className="px-4 py-2 font-medium rounded btn_backToProfileDetails text-text1 bg-text2 bg-opacity-10 hover:bg-opacity-20"
                            >
                                Hủy
                            </button>
                            <button
                                disabled={isButtonDisabled}
                                onClick={handleUpdateAvatar}
                                className="px-4 py-2 font-medium rounded text-lite bg-primary disabled:bg-opacity-50 hover:bg-opacity-80"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ChangeImageModal.propTypes = {
    type: PropTypes.string.isRequired,
};

export default ChangeImageModal;
