import ReactModal from "react-modal";
import ProfileModal from "./ProfileModal";
import { useChat } from "../../contexts/chat-context";
import ProfileDetailsModal from "./ProfileDetailsModal";
import CreateGroupChatModal from "./CreateGroupChatModal";
import SettingModal from "./SettingModal";

const Modal = () => {
    const { show, showProfileDetails, showCreateGroupChat, showSettingModal } =
        useChat();
    return (
        <>
            <ReactModal
                isOpen={show}
                overlayClassName="modal-overlay fixed inset-0 z-50 ml-16 mt-10 bg-lite shadow-lg p-2
                flex justify-center items-center w-full max-w-[280px] h-full max-h-[157px]"
                className="modal-content w-full max-w-[280px] bg-white rounded outline-none p-2 relative max-h-[157px]"
            >
                <ProfileModal />
            </ReactModal>
            <ReactModal
                isOpen={showSettingModal}
                overlayClassName="modal-overlay fixed inset-0 z-50 ml-16 mt-[520px] bg-lite shadow-lg p-2
                flex justify-center items-center w-full max-w-[280px] h-full max-h-[157px]"
                className="modal-content w-full max-w-[280px] bg-white rounded outline-none p-2 relative max-h-[157px]"
            >
                <SettingModal />
            </ReactModal>
            <ReactModal
                isOpen={showProfileDetails}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[400px] bg-white rounded outline-none relative"
            >
                <ProfileDetailsModal />
            </ReactModal>
            <ReactModal
                isOpen={showCreateGroupChat}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <CreateGroupChatModal />
            </ReactModal>
        </>
    );
};

export default Modal;
