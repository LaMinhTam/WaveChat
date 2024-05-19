import { toast } from "react-toastify";
import { useAuth } from "../../contexts/auth-context";
import { saveToken, saveUserId } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/chat-context";
import Swal from "sweetalert2";
import { axiosPrivate } from "../../api/axios";
import { useDispatch } from "react-redux";
import { setShowConversation } from "../../store/commonSlice";
import {
    setConversations,
    setListMemberOfConversation,
} from "../../store/conversationSlice";
import { setListBlockUser, setListFriend } from "../../store/userSlice";
import {
    setListFriendRequest,
    setListFriendSendRequest,
} from "../../store/friendSlice";

const SettingModal = () => {
    const {
        setShowSettingModal,
        settingModalRef,
        setShowProfileDetails,
        setShowChangePasswordModal,
    } = useChat();
    const { setUserInfo } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        setUserInfo(null);
        saveToken();
        saveUserId();
        setShowSettingModal(false);
        dispatch(setShowConversation(false));
        dispatch(setConversations([]));
        dispatch(setListMemberOfConversation([]));
        dispatch(setListFriend([]));
        dispatch(setListBlockUser([]));
        dispatch(setListFriendRequest([]));
        dispatch(setListFriendSendRequest([]));
        toast.success("Đăng xuất thành công");
        navigate("/login");
    };
    const handleDeleteAccount = async () => {
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa tài khoản này?",
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: "Cảnh báo",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosPrivate.post("/user/remove-account");
                if (res.data.status === 200) {
                    Swal.fire(
                        "Đã xóa!",
                        "Tài khoản của bạn đã bị xóa.",
                        "Thành công"
                    );
                    setUserInfo(null);
                    saveToken();
                    setShowSettingModal(false);
                    navigate("/login");
                } else {
                    Swal.fire("Lỗi!", "Đã có lỗi xảy ra.", "error");
                }
            }
        });
    };
    const handleChangePassword = () => {
        setShowSettingModal(false);
        setShowChangePasswordModal(true);
    };
    return (
        <div ref={settingModalRef}>
            <h2 className="text-xl font-semibold">Cài đặt</h2>
            <hr />
            <div className="my-1 text-sm font-normal">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileDetails(true);
                        setShowSettingModal(false);
                    }}
                    className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10"
                >
                    <span>Thông tin tài khoản</span>
                </button>
                <button className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10">
                    <span>Ngôn ngữ</span>
                </button>
            </div>
            <hr />
            <button
                className="flex items-center justify-start w-full py-1 text-sm font-normal hover:bg-text3 hover:bg-opacity-10 text-error"
                onClick={handleChangePassword}
            >
                Thay đổi mật khẩu
            </button>
            <button
                className="flex items-center justify-start w-full py-1 text-sm font-normal hover:bg-text3 hover:bg-opacity-10 text-error"
                onClick={handleDeleteAccount}
            >
                Xóa tài khoản
            </button>
            <button
                className="flex items-center justify-start w-full py-1 text-sm font-normal hover:bg-text3 hover:bg-opacity-10"
                onClick={handleLogout}
            >
                <span>Đăng xuất</span>
            </button>
        </div>
    );
};

export default SettingModal;
