import { useEffect, useState } from "react";
import { IconBack, IconClose } from "../icons";
import Radio from "../radio";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setShowUpdateProfile } from "../../store/commonSlice";
import { useChat } from "../../contexts/chat-context";
import { formatBirthDay } from "../../utils/formatDate";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { setUserProfile } from "../../store/userSlice";
import { WAVE_CHAT_API } from "../../api/constants";

const UpdateProfileModal = () => {
    const userProfile = useSelector((state) => state.user.userProfile);
    const [startDate, setStartDate] = useState(() => {
        if (userProfile.birthday) {
            const [day, month, year] = userProfile.birthday.split("/");
            return new Date(`${month}/${day}/${year}`);
        }
        return new Date();
    });
    const [nickName, setNickName] = useState(userProfile.nick_name);
    const [gender, setGender] = useState(userProfile.gender);
    const { setShowProfileDetails } = useChat();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const isUserProfileUnchanged =
            nickName === userProfile.nick_name &&
            gender === userProfile.gender &&
            formatBirthDay(startDate) === userProfile.birthday;

        setIsButtonDisabled(isUserProfileUnchanged);
    }, [gender, nickName, startDate, userProfile]);

    const handleUpdateProfile = async () => {
        if (!nickName) {
            toast.error("Tên hiển thị không được để trống");
            return;
        } else {
            const res = await axiosPrivate.post(WAVE_CHAT_API.updateProfile(), {
                ...userProfile,
                nick_name: nickName,
                gender: gender,
                birthday: formatBirthDay(startDate),
            });
            if (res.data.status === 200) {
                toast.success("Cập nhật thông tin thành công");
                dispatch(setUserProfile(res.data.data));
                dispatch(setShowUpdateProfile(false));
                setShowProfileDetails(false);
            } else {
                toast.error(res.data.message);
            }
        }
    };
    return (
        <div className="w-[400px] h-full flex flex-col">
            <div className="flex items-center w-full h-[48px]">
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 mr-2 rounded-full btn_backToProfileDetails hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => dispatch(setShowUpdateProfile(false))}
                >
                    <IconBack />
                </button>
                <span className="text-[16px] font-semibold mr-auto">
                    Cập nhật thông tin cá nhân
                </span>
                <button
                    onClick={() => {
                        dispatch(setShowUpdateProfile(false));
                        setShowProfileDetails(false);
                    }}
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                >
                    <IconClose />
                </button>
            </div>
            <hr className="w-full h-[1px] bg-text6" />
            <div className="w-full h-[368px]">
                <div className="px-4 py-3 text-sm font-normal">
                    <span>Tên hiển thị</span>
                    <input
                        type="text"
                        className="w-full px-3 focus:border-[#3989ff] border border-text4 py-2 rounded mt-1"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                </div>
                <div className="px-4 py-3">
                    <p className="text-[16px] font-medium pb-5">
                        Thông tin cá nhân
                    </p>
                    <div className="flex items-center ml-2 gap-x-10">
                        <div className="flex items-center gap-x-3">
                            <Radio
                                name={`gender`}
                                defaultChecked={userProfile.gender === 0}
                                checked={gender === 0}
                                onChange={() => setGender(0)}
                            />
                            <span>Nam</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <Radio
                                name={`gender`}
                                defaultChecked={userProfile.gender === 1}
                                checked={gender === 1}
                                onChange={() => setGender(1)}
                            />
                            <span>Nữ</span>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 gap-y-2">
                        <span>Ngày sinh</span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat={`dd/MM/yyyy`}
                            className="focus:border-[#3989ff] border border-text4 rounded mt-1 py-2 px-2"
                        />
                    </div>
                </div>
            </div>
            <hr className="w-full h-[1px] bg-text6" />
            <div className="flex items-center justify-center w-full px-4 py-2">
                <div className="flex items-center justify-center ml-auto gap-x-2">
                    <button
                        onClick={() => dispatch(setShowUpdateProfile(false))}
                        className="px-4 py-2 font-medium rounded btn_backToProfileDetails text-text1 bg-text2 bg-opacity-10 hover:bg-opacity-20"
                    >
                        Hủy
                    </button>
                    <button
                        disabled={isButtonDisabled}
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 font-medium rounded text-lite bg-primary disabled:bg-opacity-50 hover:bg-opacity-80"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
