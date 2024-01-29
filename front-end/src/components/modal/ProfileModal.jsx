import { useChat } from "../../contexts/chat-context";

const ProfileModal = () => {
    const { nodeRef } = useChat();
    return (
        <div ref={nodeRef}>
            <h2 className="text-xl font-semibold">Võ Đình Thông</h2>
            <hr />
            <div className="my-1 text-sm font-normal">
                <button className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10">
                    <span> Hồ sơ của bạn</span>
                </button>
                <button className="flex items-center justify-start w-full py-1 hover:bg-text3 hover:bg-opacity-10">
                    <span>Cài đặt</span>
                </button>
            </div>
            <hr />
            <button className="flex items-center justify-start w-full py-1 text-sm font-normal hover:bg-text3 hover:bg-opacity-10">
                <span>Đăng xuất</span>
            </button>
        </div>
    );
};

export default ProfileModal;
