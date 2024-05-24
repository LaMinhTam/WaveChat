import { useSelector } from "react-redux";
import ListFriend from "../modules/contact/ListFriend";
import ListGroup from "../modules/contact/ListGroup";
import ListFriendRequest from "../modules/contact/ListFriendRequest";

const DashboardContact = () => {
    const contactOption = useSelector((state) => state.friend.contactOption);
    return (
        <div>
            {contactOption === 0 && <ListFriend />}
            {contactOption === 1 && <ListGroup />}
            {contactOption === 2 && <ListFriendRequest />}
        </div>
    );
};

export default DashboardContact;
