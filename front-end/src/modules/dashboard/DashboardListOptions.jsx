import DashboardSearch from "./DashboardSearch";
import { useSelector } from "react-redux";
import Member from "../chat/Member";
import { v4 as uuidv4 } from "uuid";
import ContactBar from "../contact/ContactBar";
import { useEffect, useState } from "react";
import { getUserId } from "../../utils/auth";

const DashboardListOptions = () => {
    const currentTab = useSelector((state) => state.chat.currentTab);
    const conversations = useSelector(
        (state) => state.conversation.conversations
    );
    const listFriend = useSelector((state) => state.user.listFriend);
    const [data, setData] = useState([]);
    const currentUserId = getUserId();
    const id = useSelector((state) => state.conversation.id);
    useEffect(() => {
        const temp = [];
        if (currentTab === "Chat") {
            if (conversations && conversations.length > 0) {
                conversations.forEach((conversation) => {
                    if (conversation.type === 2) {
                        const friend = listFriend.find(
                            (friend) =>
                                friend.user_id ===
                                conversation.members.find(
                                    (member) => member !== currentUserId
                                )
                        );
                        if (friend) {
                            temp.push({
                                ...conversation,
                                ...friend,
                            });
                        } else {
                            temp.push(conversation);
                        }
                    } else if (conversation.type === 1) {
                        temp.push(conversation);
                    }
                });
            }

            // Add friends that are not in conversations to the temp array
            if (listFriend) {
                listFriend.forEach((friend) => {
                    const isFriendInConversation = conversations?.some(
                        (conversation) =>
                            conversation.members.includes(friend.user_id) &&
                            conversation.type === 2
                    );
                    if (!isFriendInConversation) {
                        temp.push(friend);
                    }
                });
            }
            setData(temp);
        }
    }, [conversations, currentTab, currentUserId, listFriend, id]);
    return (
        <>
            <div className="flex flex-col w-[344px]">
                <DashboardSearch />
                {currentTab === "Chat" && (
                    <div className="w-full min-h-screen border border-text4">
                        <div className="flex flex-col items-center w-full h-full custom-scrollbar">
                            {data?.map((user) => (
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
