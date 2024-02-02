import DashboardSearch from "../dashboard/DashboardSearch";
import { useSelector } from "react-redux";
import ListUser from "./ListUser";

const ListChat = () => {
    const currentTab = useSelector((state) => state.chat.currentTab);
    return (
        <div className="flex flex-col w-[344px]">
            <DashboardSearch />
            {currentTab === "Chat" && (
                <div className="flex flex-col items-center w-full h-screen overflow-scroll border border-text4 custom-scrollbar">
                    {Array.from({ length: 27 }).map((item, index) => (
                        <ListUser key={index} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListChat;
