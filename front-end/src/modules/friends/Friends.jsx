import {
    TabFriendsProvider,
    useTabFriendsContext,
} from "../../contexts/TabFriendsContext";
import FriendRequest from "./components/FriendRequest";
import SideBarFriends from "./components/SidebarFriends";

function Friends({ children }) {
    const { currentTabFriend, setCurrentTabFriend } = useTabFriendsContext();

    return (
        <>
            {currentTabFriend === "Danh sách bạn bè" && <p>Danh sách bạn bè</p>}
            {currentTabFriend === "Danh sách nhóm" && <p>Danh sách nhóm</p>}
            {currentTabFriend === "Lời mời kết bạn" && <FriendRequest />}
        </>
    );
}

export default Friends;
