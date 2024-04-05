import React from "react";
import useClickOutSide from "../hooks/useClickOutSide";

const ChatContext = React.createContext();

export function ChatProvider(props) {
    const { show, setShow, nodeRef } = useClickOutSide();
    const [conversationId, setConversationId] = React.useState("");
    const [message, setMessage] = React.useState([]);
    // This code to save the selected person when create group chat
    const [selectedList, setSelectedList] = React.useState([]);
    const {
        show: showProfileDetails,
        setShow: setShowProfileDetails,
        nodeRef: profileDetailsRef,
    } = useClickOutSide();

    const {
        show: showCreateGroupChat,
        setShow: setShowCreateGroupChat,
        nodeRef: groupChatRef,
    } = useClickOutSide();

    const {
        show: showSettingModal,
        setShow: setShowSettingModal,
        nodeRef: settingModalRef,
    } = useClickOutSide();

    const {
        show: showChangePasswordModal,
        setShow: setShowChangePasswordModal,
        nodeRef: changePasswordModalRef,
    } = useClickOutSide();

    const {
        show: showAddFriendModal,
        setShow: setShowAddFriendModal,
        nodeRef: addFriendModalRef,
    } = useClickOutSide();

    const {
        show: showSearchModal,
        setShow: setShowSearchModal,
        nodeRef: searchModalRef,
    } = useClickOutSide();

    const {
        show: showChatOptionModal,
        setShow: setShowChatOptionModal,
        nodeRef: chatOptionModalRef,
    } = useClickOutSide();

    const contextValues = {
        show,
        setShow,
        nodeRef,
        showProfileDetails,
        setShowProfileDetails,
        profileDetailsRef,
        conversationId,
        setConversationId,
        message,
        setMessage,
        showCreateGroupChat,
        setShowCreateGroupChat,
        groupChatRef,
        selectedList,
        setSelectedList,
        showSettingModal,
        setShowSettingModal,
        settingModalRef,
        showChangePasswordModal,
        setShowChangePasswordModal,
        changePasswordModalRef,
        showAddFriendModal,
        setShowAddFriendModal,
        addFriendModalRef,
        showSearchModal,
        setShowSearchModal,
        searchModalRef,
        showChatOptionModal,
        setShowChatOptionModal,
        chatOptionModalRef,
    };
    return (
        <ChatContext.Provider
            value={contextValues}
            {...props}
        ></ChatContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
    const context = React.useContext(ChatContext);
    if (typeof context === "undefined")
        throw new Error("useAuth must be used within AuthProvider");
    return context;
}
