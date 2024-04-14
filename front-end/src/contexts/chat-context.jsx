import React from "react";
import useClickOutSide from "../hooks/useClickOutSide";

const ChatContext = React.createContext();

export function ChatProvider(props) {
    const { show, setShow, nodeRef } = useClickOutSide();
    const [conversationId, setConversationId] = React.useState("");
    const [conversationDetails, setConversationDetails] = React.useState({});
    const [renderMessageDelete, setRenderMessageDelete] = React.useState(0);
    const [forwardMessage, setForwardMessage] = React.useState({});
    const [messageRefs, setMessageRefs] = React.useState({});
    const [blockType, setBlockType] = React.useState(0);
    const [renderBlock, setRenderBlock] = React.useState(0);
    const [isBlocked, setIsBlocked] = React.useState(false);
    const [replyMessage, setReplyMessage] = React.useState({});
    const [isOpenReply, setIsOpenReply] = React.useState(false);
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

    const {
        show: showForwardModal,
        setShow: setShowForwardModal,
        nodeRef: forwardModalRef,
    } = useClickOutSide();

    const {
        show: showSearchMessageModal,
        setShow: setShowSearchMessageModal,
        nodeRef: searchMessageModalRef,
    } = useClickOutSide();

    const {
        show: showAddMemberModal,
        setShow: setShowAddMemberModal,
        nodeRef: addMemberModalRef,
    } = useClickOutSide();

    const {
        show: showMemberOption,
        setShow: setShowMemberOption,
        nodeRef: memberOptionRef,
    } = useClickOutSide();

    const {
        show: showPassPermissionModal,
        setShow: setShowPassPermissionModal,
        nodeRef: passPermissionModalRef,
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
        conversationDetails,
        setConversationDetails,
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
        showForwardModal,
        setShowForwardModal,
        forwardModalRef,
        renderMessageDelete,
        setRenderMessageDelete,
        forwardMessage,
        setForwardMessage,
        showSearchMessageModal,
        setShowSearchMessageModal,
        searchMessageModalRef,
        messageRefs,
        setMessageRefs,
        blockType,
        setBlockType,
        renderBlock,
        setRenderBlock,
        isBlocked,
        setIsBlocked,
        replyMessage,
        setReplyMessage,
        isOpenReply,
        setIsOpenReply,
        showAddMemberModal,
        setShowAddMemberModal,
        addMemberModalRef,
        showMemberOption,
        setShowMemberOption,
        memberOptionRef,
        showPassPermissionModal,
        setShowPassPermissionModal,
        passPermissionModalRef,
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
        throw new Error("useChat must be used within ChatProvider");
    return context;
}
