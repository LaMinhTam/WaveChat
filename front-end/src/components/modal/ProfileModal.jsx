import { useSelector } from "react-redux";
import { useAuth } from "../../contexts/auth-context";
import { useChat } from "../../contexts/chat-context";
import { saveToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileModal = () => {
    const { nodeRef, setShowProfileDetails, setShow } = useChat();
    const { setUserInfo } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        setUserInfo("");
        saveToken();
        toast.success("Đăng xuất thành công");
        navigate("/login");
    };
    const currentUserName = useSelector(
        (state) => state.common.currentUserName
    );
    return (
        <div ref={nodeRef}>
            <h2 className="text-xl font-semibold">{currentUserName}</h2>
            <hr />
            <div className="my-1 text-sm font-normal">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileDetails(true);
                        setShow(false);
                    }}
                    className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10"
                >
                    <span> Hồ sơ của bạn</span>
                </button>
                <button className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10">
                    <span>Cài đặt</span>
                </button>
            </div>
            <hr />
            <button
                className="flex items-center justify-start w-full py-1 text-sm font-normal hover:bg-text3 hover:bg-opacity-10"
                onClick={handleLogout}
            >
                <span>Đăng xuất</span>
            </button>
        </div>
    );
};

export default ProfileModal;
