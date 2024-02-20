// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useSelector } from "react-redux";
import RequiredAuthPage from "./RequiredAuthPage";
import Conversation from "../modules/chat/conversation/Conversation";

const DashboardPage = () => {
    const showConversation = useSelector(
        (state) => state.common.showConversation
    );
    const currentTab = useSelector((state) => state.chat.currentTab);
    return (
        <RequiredAuthPage>
            {/* <DashboardWelcome /> */}
            {currentTab === "Chat" && showConversation && <Conversation />}
        </RequiredAuthPage>
    );
};
export default DashboardPage;
