import ReactModal from "react-modal";
import ProfileModal from "./ProfileModal";
import { useChat } from "../../contexts/chat-context";
import ProfileDetailsModal from "./ProfileDetailsModal";
import CreateGroupChatModal from "./CreateGroupChatModal";
import SettingModal from "./SettingModal";
import ChangePasswordModal from "./ChangePasswordModal";
import AddFriendModal from "./AddFriendModal";
import SearchModal from "./SearchModal";
import ForwardModal from "./ForwardModal";
import SearchMessageModal from "./SearchMessageModal";
import AddMemberModal from "./AddMemberModal";
import ModalPassPermission from "./ModalPassPermission";
import ModalGroupInfo from "./ModalGroupInfo";
import ModalChangeGroupName from "./ModalChangeGroupName";
import VideoCall from "./VideoCall";
import { useSocket } from "../../contexts/socket-context";

const Modal = () => {
    const {
        show,
        showProfileDetails,
        showCreateGroupChat,
        showSettingModal,
        showChangePasswordModal,
        showAddFriendModal,
        showSearchModal,
        showForwardModal,
        showSearchMessageModal,
        showAddMemberModal,
        showPassPermissionModal,
        showModalGroupInfo,
        showModalChangeGroupName,
    } = useChat();
    const { showVideoCallModal } = useSocket();
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
                isOpen={showSearchModal}
                overlayClassName="modal-overlay fixed inset-0 z-50 ml-16 mt-16 bg-lite shadow-lg
                flex justify-center items-center w-full max-w-[350px] h-full max-h-[80px]"
                className="modal-content w-full max-w-[280px] bg-white rounded outline-none relative"
            >
                <SearchModal />
            </ReactModal>
            <ReactModal
                isOpen={showAddFriendModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[400px] bg-white rounded outline-none relative"
            >
                <AddFriendModal />
            </ReactModal>
            <ReactModal
                isOpen={showSettingModal}
                overlayClassName="modal-overlay fixed inset-0 z-50 ml-16 mt-[520px] bg-lite shadow-lg p-2
                flex justify-center items-center w-full max-w-[280px] h-full max-h-[200px]"
                className="modal-content w-full max-w-[280px] bg-white rounded outline-none p-2 relative max-h-[200px]"
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
                isOpen={showModalGroupInfo}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[400px] bg-white rounded outline-none relative"
            >
                <ModalGroupInfo />
            </ReactModal>
            <ReactModal
                isOpen={showChangePasswordModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[400px] bg-white rounded outline-none relative"
            >
                <ChangePasswordModal />
            </ReactModal>
            <ReactModal
                isOpen={showCreateGroupChat}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <CreateGroupChatModal />
            </ReactModal>
            <ReactModal
                isOpen={showForwardModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <ForwardModal />
            </ReactModal>
            <ReactModal
                isOpen={showAddMemberModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <AddMemberModal />
            </ReactModal>
            <ReactModal
                isOpen={showVideoCallModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[700px] bg-white rounded outline-none relative"
            >
                <VideoCall />
            </ReactModal>
            <ReactModal
                isOpen={showPassPermissionModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <ModalPassPermission />
            </ReactModal>
            <ReactModal
                isOpen={showModalChangeGroupName}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <ModalChangeGroupName />
            </ReactModal>
            <ReactModal
                isOpen={showSearchMessageModal}
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                flex justify-center items-center"
                className="modal-content w-full max-w-[520px] bg-white rounded outline-none relative"
            >
                <SearchMessageModal />
            </ReactModal>
        </>
    );
};

export default Modal;
