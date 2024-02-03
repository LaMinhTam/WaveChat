import React, { useEffect, useState } from "react";
import Heading, { Heading2 } from '../modules/friends/components/Heading'
import FriendCard from "../modules/friends/components/FriendCard";
import { useSelector } from "react-redux";
import { getToken } from '../../../utils/auth'
import axios from "axios";

const ListFriendsPage = () => {
    const acceskey = getToken();
    const [friendList, setFriendList] = useState([]);
    const openFriends = useSelector((state) => state.friends.openFriends);


    useEffect(() => {
        async function fetchFriendList (accessToken) {
            try {
                const res = await axios.get('http://localhost:3000/friend?type=4', {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                // Access the array of friend requests
                const friendListArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data]

                console.log(friendListArray)
                return friendListArray
            } catch (error) {
                console.error('Error fetching friend requests:', error)
                return []
            }
        }
        async function fetchData() {
            try {
                const list = await fetchFriendList(acceskey)
                setFriendList(list)
            } catch (error) {
                console.error('Error setting friend requests sent:', error)
            }
        }
        fetchData();
    }, []);

    // Function to group friends alphabetically
    const groupFriendsByAlphabet = () => {
        const groupedFriends = {};
        friendList.forEach(friend => {
            const firstLetter = friend.full_name.charAt(0).toUpperCase();
            if (!groupedFriends[firstLetter]) {
                groupedFriends[firstLetter] = [];
            }
            groupedFriends[firstLetter].push(friend);
        });
        return groupedFriends;
    };

    return (
        <div>
            <div className="flex gap-2 flex-wrap p-4">
                <div className="w-full">
                    <Heading2 text={`Danh sách bạn bè: `} />
                </div>
            </div>
            {Object.entries(groupFriendsByAlphabet()).map(([letter, friends]) => (
                <div className="p-2" key={letter}>
                    <Heading2  text={letter}/>
                    {friends.map(friend => (
                        <FriendCard key={friend.user_id} friend={friend} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ListFriendsPage;
