
import {useSelector} from "react-redux"

const ListFriendsPage = () => {

    const openFriends = useSelector((state)=>state.friends.openFriends)

    return <div>
        <div className="left" > </div>
        //sự kiện open của th left, nếu th left open
        <div className="main" onClick={()=>{}}> 
            
        </div>
    </div>;
};

export default ListFriendsPage;
