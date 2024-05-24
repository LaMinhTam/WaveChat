import PhoneInput from "react-phone-input-2";
import { useChat } from "../../contexts/chat-context";
import { IconClose } from "../icons";
import { useState } from "react";
import fetchUserByPhone from "../../api/fetchUserByPhone";
import { useDispatch } from "react-redux";
import { setGuestProfile } from "../../store/userSlice";
import { setProfileType } from "../../store/commonSlice";
import { getUserId } from "../../utils/auth";

const AddFriendModal = () => {
    const { setShowAddFriendModal, addFriendModalRef, setShowProfileDetails } =
        useChat();
    const [phone, setPhone] = useState("");
    const dispatch = useDispatch();
    const currentUserId = getUserId();
    const handleSearchUser = async () => {
        if (!phone) return;
        else {
            let newPhone = phone.slice(2);
            const data = await fetchUserByPhone(newPhone);
            if (data) {
                dispatch(setGuestProfile(data));
                if (data._id !== currentUserId) {
                    dispatch(setProfileType("guest"));
                }
                setShowProfileDetails(true);
                setShowAddFriendModal(false);
            }
        }
    };
    return (
        <div ref={addFriendModalRef}>
            <div className="w-[400px] h-full p-2 flex flex-col">
                <div className="flex items-center w-full h-[48px]">
                    <span className="text-[16px] font-semibold mr-auto">
                        Thêm bạn
                    </span>
                    <button
                        onClick={() => setShowAddFriendModal(false)}
                        className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10"
                    >
                        <IconClose />
                    </button>
                </div>
                <div className="mb-3">
                    <PhoneInput
                        country={"vn"}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        containerClass="relative"
                        inputClass="w-full min-w-[350px] px-6 py-4 text-sm font-medium border rounded-xl
                        placeholder:text-text4 dark:placeholder:text-text2 bg-transparent
                        border-b border-blue-500"
                        placeholder="Số điện thoại"
                    />
                </div>
                <div>
                    <span className="text-sm font-normal text-text7">
                        Kết quả gần đây
                    </span>
                    <div>
                        <div className="w-full h-[72px] flex items-center gap-x-2 hover:bg-text6">
                            <div className="w-[40px] h-[40px] rounded-full">
                                <img
                                    className="object-cover w-full h-full rounded-full"
                                    src="https://source.unsplash.com/random"
                                    alt=""
                                />
                            </div>
                            <div className="flex flex-col">
                                <span>Ngoc Anh</span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="py-[14px] px-4 flex items-center">
                        <div></div>
                        <div className="flex items-center ml-auto gap-x-3">
                            <button className="px-4 py-2 bg-text6">Hủy</button>
                            <button
                                className="px-4 py-2 bg-secondary text-lite"
                                onClick={handleSearchUser}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFriendModal;
