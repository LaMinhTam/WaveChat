import { useDispatch, useSelector } from "react-redux";
import {
    IconChat,
    IconContact,
    IconLight,
    IconLogout,
    IconSetting,
} from "../../components/icons";
import { useChat } from "../../contexts/chat-context";
import { setCurrentTab } from "../../store/chatSlice";
import s3ImageUrl from "../../utils/s3ImageUrl";

const sidebarLinks = [
    {
        title: "Profile",
    },
    {
        icon: <IconChat></IconChat>,
        title: "Chat",
    },
    {
        icon: <IconContact></IconContact>,
        title: "Contact",
    },
    {
        icon: <IconSetting></IconSetting>,
        title: "Setting",
    },
    {
        icon: <IconLight></IconLight>,
        title: "Light/Dark",
        url: "#",
        onClick: () => {},
    },
    {
        icon: <IconLogout></IconLogout>,
        title: "Logout",
    },
];

const DashboardSideBar = () => {
    const dispatch = useDispatch();
    const { setShow } = useChat();
    const currentTab = useSelector((state) => state.chat.currentTab);
    const userProfile = useSelector((state) => state.user.userProfile);
    return (
        <div className="flex flex-col w-[64px] min-h-screen items-center bg-primary text-lite">
            {sidebarLinks.map((item) => {
                if (item.title == "Profile") {
                    return (
                        <div key={item.title} className="w-[48px] h-[100px]">
                            <div
                                className="w-[48px] h-[48px] mt-[32px] cursor-pointer mb-[42px]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShow(true);
                                }}
                            >
                                <img
                                    src={s3ImageUrl(
                                        userProfile?.avatar,
                                        userProfile?._id
                                    )}
                                    alt="profile"
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>
                        </div>
                    );
                } else if (item.title === "Setting") {
                    return (
                        <button
                            key={item.title}
                            className="w-[64px] h-[64px] flex items-center justify-center mt-auto"
                        >
                            <span>{item.icon}</span>
                        </button>
                    );
                } else if (
                    item.title === "Light/Dark" ||
                    item.title === "Logout"
                ) {
                    return (
                        <button
                            key={item.title}
                            className="w-[64px] h-[64px] flex items-center justify-center"
                        >
                            <span>{item.icon}</span>
                        </button>
                    );
                } else {
                    return (
                        <button
                            key={item.title}
                            className={`w-[64px] h-[64px] flex items-center justify-center ${
                                currentTab === item.title ? "bg-secondary" : ""
                            }`}
                            onClick={() => dispatch(setCurrentTab(item.title))}
                        >
                            <span>{item.icon}</span>
                        </button>
                    );
                }
            })}
        </div>
    );
};

export default DashboardSideBar;
