// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useDispatch, useSelector } from "react-redux";
import RequiredAuthPage from "./RequiredAuthPage";
import Conversation from "../modules/chat/conversation/Conversation";
import { useEffect } from "react";
import fetchCurrentUserFriends from "../api/fetchCurrentUserFriends";
import { setListFriend } from "../store/userSlice";
import fetchConversations from "../api/fetchConversations";
import { setConversations } from "../store/conversationSlice";
import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { getToken } from "../utils/auth";
import DashboardContact from "./DashboardContact";

const DashboardPage = () => {
    const showConversation = useSelector(
        (state) => state.common.showConversation
    );
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.chat.currentTab);
    const id = useSelector((state) => state.conversation.id);
    const token = getToken();
    useEffect(() => {
        async function fetchData() {
            if (token) {
                try {
                    const friends = await fetchCurrentUserFriends();
                    dispatch(setListFriend(friends));
                    const conversations = await fetchConversations();
                    dispatch(setConversations(conversations));
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchData();
    }, [dispatch, id, token]);
    return (
        <RequiredAuthPage>
            {currentTab === "Chat" && showConversation && <Conversation />}
            {currentTab === "Chat" && !showConversation && <DashboardWelcome />}
            {currentTab === "Contact" && <DashboardContact />}
        </RequiredAuthPage>
    );
};
export default DashboardPage;
