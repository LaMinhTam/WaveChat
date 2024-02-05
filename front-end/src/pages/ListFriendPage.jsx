import { useEffect, useState } from "react";
import { Heading2 } from '../modules/friends/components/Heading'
import FriendCard from "../modules/friends/components/FriendCard";
import { useSelector } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getToken } from '../../../utils/auth'
import axios from "axios";

const ListFriendsPage = () => {
    const acceskey = getToken();
    const [friendList, setFriendList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
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
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredFriendList = friendList.filter(friend => {
        return friend.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    const toggleSortOrder = () => {
        // Toggle the sort order between "asc" and "desc"
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Function to group friends alphabetically
    const groupFriendsByAlphabet = () => {
        const filteredList = friendList.filter(friend => {
            return friend.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        const groupedFriends = {};
        filteredList.forEach(friend => {
            const firstLetter = friend.full_name.charAt(0).toUpperCase();
            if (!groupedFriends[firstLetter]) {
                groupedFriends[firstLetter] = [];
            }
            groupedFriends[firstLetter].push(friend);
        });

        for (const letter in groupedFriends) {
            groupedFriends[letter].sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.full_name.localeCompare(b.full_name);
                } else {
                    return b.full_name.localeCompare(a.full_name);
                }
            });
        }
        return groupedFriends;
    };

    return (
        <div>
            <div className="flex gap-2 flex-wrap p-4">

                <div className="flex gap-2 flex-wrap p-4">
                    <div className="w-full">
                        <Heading2 text={`Danh sach ban be`} />
                    </div>
                    <div className="flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <SearchIcon className="absolute top-3 left-3 text-gray-500" />
                    </div>
                    <button onClick={toggleSortOrder} className="flex items-center space-x-1 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
                        {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        <span>Sort</span>
                        <span className="ml-1">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                    </button>
                </div>
            </div>
            {Object.entries(groupFriendsByAlphabet(filteredFriendList)).map(([letter, friends]) => (
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
