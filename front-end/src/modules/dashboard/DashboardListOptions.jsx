import DashboardSearch from "./DashboardSearch";
import { useSelector } from "react-redux";
import Member from "../chat/Member";
import { v4 as uuidv4 } from "uuid";
import ContactBar from "../contact/ContactBar";

const DashboardListOptions = () => {
    const currentTab = useSelector((state) => state.chat.currentTab);
    const conversations = useSelector(
        (state) => state.conversation.conversations
    );
    return (
        <>
            <div className="flex flex-col w-[344px]">
                <DashboardSearch />
                {currentTab === "Chat" && (
                    <div className="w-full min-h-screen border border-text4">
                        <div className="flex flex-col items-center w-full h-full custom-scrollbar">
                            {conversations?.map((user) => (
                                <Member key={uuidv4()} user={user} />
                            ))}
                        </div>
                    </div>
                )}
                {currentTab === "Contact" && <ContactBar />}
            </div>
        </>
    );
};

export default DashboardListOptions;
