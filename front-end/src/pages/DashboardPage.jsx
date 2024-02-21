// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useDispatch, useSelector } from "react-redux";
import RequiredAuthPage from "./RequiredAuthPage";
import Conversation from "../modules/chat/conversation/Conversation";
import { useEffect } from "react";
import fetchCurrentUserFriends from "../api/fetchCurrentUserFriends";
import { setListFriend } from "../store/userSlice";
import fetchConversations from "../api/fetchConversations";
import { setConversations } from "../store/conversationSlice";

const DashboardPage = () => {
    const showConversation = useSelector(
        (state) => state.common.showConversation
    );
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.chat.currentTab);
    useEffect(() => {
        async function fetchData() {
            try {
                const friends = await fetchCurrentUserFriends();
                dispatch(setListFriend(friends));
                const conversations = await fetchConversations();
                dispatch(setConversations(conversations));
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [dispatch]);
    return (
        <RequiredAuthPage>
            {/* <DashboardWelcome /> */}
            {currentTab === "Chat" && showConversation && <Conversation />}
        </RequiredAuthPage>
    );
};
export default DashboardPage;
