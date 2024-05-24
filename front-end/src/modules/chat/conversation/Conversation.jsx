import { useSelector } from "react-redux";
import ConversationChatInput from "./ConversationChatInput";
import ConversationContent from "./ConversationContent";
import ConversationHeader from "./ConversationHeader";
import ConversationToolbar from "./ConversationToolbar";
import { useEffect, useState } from "react";
import ConversationInfo from "./ConversationInfo";
import { motion } from "framer-motion";
import { useSocket } from "../../../contexts/socket-context";
import Swal from "sweetalert2";
import { useChat } from "../../../contexts/chat-context";
import alertRemoveBlock from "../../../utils/alertRemoveBlock";
import { axiosPrivate } from "../../../api/axios";
import { useDispatch } from "react-redux";
import {
    setIsAdmin,
    setIsConfirmNewMember,
    setIsSubAdmin,
    setListMemberOfConversation,
    setWaitingList,
} from "../../../store/conversationSlice";
import { getUserId } from "../../../utils/auth";
import {
    CONVERSATION_MEMBER_PERMISSION,
    WAVE_CHAT_API,
} from "../../../api/constants";

const Conversation = () => {
    const dispatch = useDispatch();
    const friendInfo = useSelector((state) => state.user.friendInfo);
    const showConversationInfo = useSelector(
        (state) => state.common.showConversationInfo
    );
    const currentUserId = getUserId();
    const { message, socket } = useSocket();
    const isGroupChat = useSelector((state) => state.conversation.isGroupChat);
    const isConfirmNewMember = useSelector(
        (state) => state.conversation.isConfirmNewMember
    );
    const triggerFetchListMember = useSelector(
        (state) => state.common.triggerFetchListMember
    );

    const [imageMessage, setImageMessage] = useState([]);
    const [fileMessage, setFileMessage] = useState([]);
    const {
        blockType,
        setBlockType,
        setIsBlocked,
        showProfileDetails,
        conversationId,
        currentConversation,
        setCurrentConversation,
    } = useChat(); // [0: not block, 1: block, 2: blocked by other user]

    useEffect(() => {
        async function fetchConversationDetails() {
            const resDetails = await axiosPrivate.get(
                WAVE_CHAT_API.conversationDetail(conversationId)
            );
            if (resDetails.data.status === 200) {
                let is_confirm_new_member =
                    resDetails.data.data.is_confirm_new_member;
                dispatch(
                    setIsConfirmNewMember(
                        is_confirm_new_member === 1 ? true : false
                    )
                );
                setCurrentConversation(resDetails.data.data);
                let block_type = resDetails.data.data.block_type;
                setBlockType(block_type);
            }
        }
        fetchConversationDetails();
    }, [
        conversationId,
        dispatch,
        isGroupChat,
        setBlockType,
        setCurrentConversation,
    ]);

    useEffect(() => {
        async function fetchWaitingList() {
            const res = await axiosPrivate.get(
                WAVE_CHAT_API.groupWaitingList(conversationId)
            );
            if (res.data.status === 200) {
                dispatch(setWaitingList(res.data.data));
            }
        }
        if (conversationId && isGroupChat && isConfirmNewMember) {
            fetchWaitingList();
        }
    }, [conversationId, dispatch, isConfirmNewMember, isGroupChat]);

    useEffect(() => {
        async function fetchMemberInConversation() {
            const res = await axiosPrivate.get(
                WAVE_CHAT_API.groupListMember(conversationId)
            );
            if (res.data.status === 200) {
                const listMember = res.data.data;
                let admin = listMember.find(
                    (member) =>
                        member.permission ===
                        CONVERSATION_MEMBER_PERMISSION.OWNER
                );
                if (admin && admin.user_id === currentUserId) {
                    dispatch(setIsAdmin(true));
                } else {
                    dispatch(setIsAdmin(false));
                }
                let subAdmin = listMember.find(
                    (member) =>
                        member.permission ===
                        CONVERSATION_MEMBER_PERMISSION.DEPUTY
                );
                if (subAdmin && subAdmin.user_id === currentUserId) {
                    dispatch(setIsSubAdmin(true));
                } else {
                    dispatch(setIsSubAdmin(false));
                }
                dispatch(setListMemberOfConversation(res.data.data));
            }
        }
        if (isGroupChat && conversationId) {
            fetchMemberInConversation();
        }
    }, [
        conversationId,
        currentUserId,
        dispatch,
        isGroupChat,
        triggerFetchListMember,
    ]);

    useEffect(() => {
        if (blockType === 0) {
            return;
        } else if (blockType === 1 && !showProfileDetails) {
            alertRemoveBlock({
                user_id: friendInfo._id,
                setIsBlocked,
                setBlockType,
            });
        } else if (blockType === 2) {
            Swal.fire({
                title: "Thông báo",
                text: "Bạn đã bị chặn bởi người này",
                icon: "warning",
                confirmButtonText: "OK",
            });
        }
    }, [
        blockType,
        friendInfo._id,
        setBlockType,
        setIsBlocked,
        showProfileDetails,
    ]);

    useEffect(() => {
        setImageMessage([]);
        setFileMessage([]);
        message?.forEach((msg) => {
            if (msg.type === 2) {
                setImageMessage((prev) =>
                    Array.isArray(prev)
                        ? [
                              ...prev,
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                        : [
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                );
            } else if (msg.type === 5) {
                setFileMessage((prev) =>
                    Array.isArray(prev)
                        ? [
                              ...prev,
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                        : [
                              {
                                  id: msg.user._id,
                                  media: msg.media[0],
                                  created_at: msg.created_at,
                              },
                          ]
                );
            }
        });
    }, [message]);

    return (
        <div className="flex items-center justify-center">
            <div className="relative flex flex-col w-full h-screen">
                <ConversationHeader
                    name={
                        isGroupChat
                            ? currentConversation.name
                            : friendInfo.full_name
                    }
                    avatar={
                        isGroupChat
                            ? currentConversation.avatar
                            : friendInfo.avatar
                    }
                    userId={
                        isGroupChat
                            ? currentConversation.conversation_id
                            : friendInfo._id
                    }
                />
                <div className="w-full h-full">
                    <ConversationContent message={message} socket={socket} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex-shrink-0 mt-auto shadow-md">
                    <ConversationToolbar
                        user_id={friendInfo._id}
                        socket={socket}
                        blockType={blockType}
                    />
                    <ConversationChatInput
                        user_id={friendInfo._id}
                        socket={socket}
                        blockType={blockType}
                        setBlockType={setBlockType}
                    />
                </div>
            </div>
            {showConversationInfo && (
                <motion.div
                    initial={{ x: "344px" }}
                    animate={{ x: 0 }}
                    exit={{ x: "344px" }}
                    transition={{ duration: 0.3 }}
                >
                    <ConversationInfo
                        name={
                            isGroupChat
                                ? currentConversation.name
                                : friendInfo.full_name
                        }
                        avatar={
                            isGroupChat
                                ? currentConversation.avatar
                                : friendInfo.avatar
                        }
                        userId={
                            isGroupChat
                                ? currentConversation.conversation_id
                                : friendInfo._id
                        }
                        images={imageMessage}
                        files={fileMessage}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default Conversation;
