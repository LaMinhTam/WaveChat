import FriendRequest from "./components/FriendRequest";
import SideBarFriends from "./components/SidebarFriends";

function Friends({ children }) {
    return <div>
        <div className="flex  w-screen min-h-screen">
            <div className="w-1/4 min-w-80 border-solid border-r border-black-800">
                <SideBarFriends/>
            </div>

            <div className="flex-1 bg-gray-200">
                

                
                    <FriendRequest/>
                    {children}
                
            </div>
        </div>
    
    </div>;
}

export default Friends