import DashboardSearch from "./DashboardSearch";
import { useDispatch, useSelector } from "react-redux";
import UserFriend from "../chat/ListUser";
import { useEffect } from "react";
import fetchCurrentUserFriends from "../../api/fetchCurrentUserFriends";
import { setFriendInfo, setListFriend } from "../../store/userSlice";
import { setActiveName, setShowConversation } from "../../store/commonSlice";

const DashboardListOptions = () => {
    const currentTab = useSelector((state) => state.chat.currentTab);
    const dispatch = useDispatch();
    const listFriend = useSelector((state) => state.user.listFriend);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchCurrentUserFriends();
            dispatch(setListFriend(data));
        }
        fetchData();
    }, [dispatch]);
    return (
        <div className="flex flex-col w-[344px]">
            <DashboardSearch />
            {currentTab === "Chat" && (
                <div className="w-full min-h-screen border border-text4">
                    <div className="flex flex-col items-center w-full h-full custom-scrollbar">
                        {listFriend.map((user) => (
                            <UserFriend
                                key={user.user_id}
                                user={user}
                                onClick={() => {
                                    dispatch(setFriendInfo(user));
                                    dispatch(setShowConversation(true));
                                    dispatch(setActiveName(user.nick_name));
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardListOptions;
