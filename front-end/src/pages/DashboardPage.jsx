// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import Conversation from "../modules/chat/Conversation";
import RequiredAuthPage from "./RequiredAuthPage";

const DashboardPage = () => {
    return (
        <RequiredAuthPage>
            {/* <DashboardWelcome /> */}
            <Conversation />
        </RequiredAuthPage>
    );
};
export default DashboardPage;
