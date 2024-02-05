// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useSelector } from "react-redux";
import Conversation from "../modules/chat/Conversation";
import RequiredAuthPage from "./RequiredAuthPage";

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
