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
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { saveToken } from "../../utils/auth";
import { setId } from "../../store/conversationSlice";
import { setContactOption, setRender } from "../../store/friendSlice";

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
    const { setUserInfo } = useAuth();
    const { setShow, setShowSettingModal } = useChat();
    const currentTab = useSelector((state) => state.chat.currentTab);
    const userProfile = useSelector((state) => state.user.userProfile);
    const navigate = useNavigate();
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
                                    setShowSettingModal(false);
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSettingModal(true);
                                setShow(false);
                            }}
                            className="w-[64px] h-[64px] flex items-center justify-center mt-auto hover:bg-secondary hover:bg-opacity-50"
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
                            className="w-[64px] h-[64px] flex items-center justify-center hover:bg-secondary hover:bg-opacity-50"
                            onClick={
                                item.title === "Logout"
                                    ? () => {
                                          setUserInfo(null);
                                          saveToken();
                                          setShow(false);
                                          toast.success("Đăng xuất thành công");
                                          navigate("/login");
                                      }
                                    : item.onClick
                            }
                        >
                            <span>{item.icon}</span>
                        </button>
                    );
                } else {
                    return (
                        <button
                            key={item.title}
                            className={`w-[64px] h-[64px] flex items-center justify-center ${
                                currentTab === item.title
                                    ? "bg-secondary"
                                    : "hover:bg-secondary hover:bg-opacity-50"
                            }`}
                            onClick={() => {
                                dispatch(setCurrentTab(item.title));
                                dispatch(setId(Math.random() * 1000));
                                dispatch(setRender(Math.random() * 1000));
                                dispatch(setContactOption(0));
                            }}
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
