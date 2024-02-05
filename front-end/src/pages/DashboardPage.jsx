// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useSelector } from "react-redux";
import Conversation from "../modules/chat/Conversation";
import RequiredAuthPage from "./RequiredAuthPage";
import { useTabFriendsContext } from '../contexts/TabFriendsContext'
import Friends from '../modules/friends/Friends'

const DashboardPage = () => {
    const showConversation = useSelector(
        (state) => state.common.showConversation
    );
    const currentTab = useSelector((state) => state.chat.currentTab);
    return (
        <RequiredAuthPage>
            {/* <DashboardWelcome /> */}
            {currentTab === "Chat" && showConversation && <Conversation />}
            {currentTab === 'Contact' && <Friends />}
        </RequiredAuthPage>
    );
};
export default DashboardPage;
