import React from "react";
import useClickOutSide from "../hooks/useClickOutSide";

const ChatContext = React.createContext();

export function ChatProvider(props) {
    const { show, setShow, nodeRef } = useClickOutSide();
    const {
        show: showProfileDetails,
        setShow: setShowProfileDetails,
        nodeRef: profileDetailsRef,
    } = useClickOutSide();
    const contextValues = {
        show,
        setShow,
        nodeRef,
        showProfileDetails,
        setShowProfileDetails,
        profileDetailsRef,
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
