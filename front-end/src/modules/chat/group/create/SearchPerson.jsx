import { useEffect, useState } from "react";
import { IconSearch } from "../../../../components/icons";
import { useChat } from "../../../../contexts/chat-context";
import Person from "./Person";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { axiosPrivate } from "../../../../api/axios";
import { getUserId } from "../../../../utils/auth";
import { motion } from "framer-motion";
import sortedPersonToAlphabet from "../../../../utils/sortedPersonToAlphabet";

const SearchPerson = () => {
    const [removedInputId, setRemovedInputId] = useState("");
    const { selectedList, setSelectedList } = useChat();
    const [searchValue, setSearchValue] = useState("");
    const listFriend = useSelector((state) => state.user.listFriend);
    const [searchResult, setSearchResult] = useState([]);
    const [personList, setPersonList] = useState([]);
    const conversations = useSelector(
        (state) => state.conversation.conversations
    );
    const finalListFriend = sortedPersonToAlphabet(listFriend);

    const currentUserId = getUserId();

    useEffect(() => {
        let recentChatList = conversations?.map((item) => {
            if (item.type === 2) {
                const otherId = conversations.map((item) => {
                    if (item.members[0] === currentUserId) {
                        return item.members[1];
                    } else {
                        return item.members[0];
                    }
                });
                return {
                    user_id: otherId[0],
                    full_name: item.name,
                    avatar: item.avatar,
                };
            } else {
                return null;
            }
        });
        // remove the null value in recentChatList
        recentChatList = recentChatList?.filter((item) => item !== null);
        const PersonList = [
            {
                type: "chat_recent",
                title: "Trò chuyện gần đây",
                data: recentChatList,
            },
            {
                type: "friend",
                title: "Danh sách bạn bè",
                data: finalListFriend,
            },
        ];
        setPersonList(PersonList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectPerson = (user) => {
        setSelectedList((prevList) => {
            const isExist = prevList.some(
                (item) => item.user_id === user.user_id
            );
            if (!isExist) {
                return [...prevList, user];
            } else {
                return prevList.filter((item) => item.user_id !== user.user_id);
            }
        });
    };

    const handleRemovePerson = (user) => {
        setSelectedList((prevList) =>
            prevList.filter((item) => item.user_id !== user.user_id)
        );
        setRemovedInputId(user.user_id);
    };

    useEffect(() => {
        if (removedInputId) {
            const input = document.getElementById(removedInputId);
            if (input) {
                input.checked = false;
            }
            setRemovedInputId("");
        }
    }, [removedInputId]);

    useEffect(() => {
        // check if searchValue is a number

        async function fetchUserByPhone() {
            try {
                const response = await axiosPrivate.get(
                    `/user/find-phone?phone=${searchValue}`
                );
                const data = response.data.data.user;
                if (data) {
                    setSearchResult([
                        {
                            ...data,
                            user_id: data._id,
                        },
                    ]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (searchValue.length > 0) {
            if (searchValue.length === 10 && !isNaN(Number(searchValue))) {
                fetchUserByPhone();
            } else {
                const result = listFriend.filter((item) =>
                    item.full_name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                );
                setSearchResult(result);
            }
        } else {
            setSearchResult([]);
        }
    }, [listFriend, searchValue, setSelectedList]);

    if (!personList) return null;

    return (
        <div className="z-10 bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="p-3">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        <IconSearch />
                    </div>
                    <input
                        type="text"
                        id="input-group-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                        placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </div>
                <div>
                    {!isNaN(Number(searchValue)) &&
                        searchResult.length === 1 &&
                        searchResult.map((user) => (
                            <li key={uuidv4()}>
                                <Person
                                    inputName={user._id}
                                    fullName={user.full_name}
                                    onClick={() => {
                                        handleSelectPerson(user);
                                        setSearchValue("");
                                        setSearchResult([]);
                                    }}
                                    avatarName={user.avatar}
                                />
                            </li>
                        ))}
                </div>
            </div>
            <div className="flex items-center px-4 py-2 border-t border-gray-300">
                <ul className="px-3 pb-3 overflow-y-auto text-sm text-gray-700 h-[400px] dark:text-gray-200 mr-3 flex-1">
                    {searchResult &&
                        searchResult.length > 1 &&
                        searchResult.map((user) => (
                            <li key={uuidv4()}>
                                <Person
                                    inputName={user.user_id}
                                    fullName={user.full_name}
                                    onClick={() => {
                                        handleSelectPerson(user);
                                        setSearchValue("");
                                        setSearchResult([]);
                                    }}
                                    avatarName={user.avatar}
                                />
                            </li>
                        ))}
                    {!isNaN(Number(searchValue)) &&
                        personList &&
                        personList?.map((item) => (
                            <li key={uuidv4()}>
                                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-300">
                                    {item.title}
                                </h3>
                                <ul>
                                    {item.type === "chat_recent" &&
                                        item?.data?.map((user) => (
                                            <li key={uuidv4()}>
                                                <Person
                                                    inputName={user.user_id}
                                                    fullName={user.full_name}
                                                    onClick={() =>
                                                        handleSelectPerson(user)
                                                    }
                                                    isChecked={selectedList.some(
                                                        (item) =>
                                                            item.user_id ===
                                                            user.user_id
                                                    )}
                                                    avatarName={user.avatar}
                                                />
                                            </li>
                                        ))}
                                    {item.type === "friend" &&
                                        item?.data?.map((user) => (
                                            <ul key={uuidv4()}>
                                                <h3 className="my-2 mr-3 text-sm font-medium text-text1 dark:text-lite">
                                                    {user.key}
                                                </h3>
                                                {user.data.map((person) => (
                                                    <Person
                                                        key={uuidv4()}
                                                        inputName={
                                                            person.user_id
                                                        }
                                                        fullName={
                                                            person.full_name
                                                        }
                                                        onClick={() =>
                                                            handleSelectPerson(
                                                                person
                                                            )
                                                        }
                                                        isChecked={selectedList.some(
                                                            (item) =>
                                                                item.user_id ===
                                                                person.user_id
                                                        )}
                                                        avatarName={
                                                            person.avatar
                                                        }
                                                    />
                                                ))}
                                            </ul>
                                        ))}
                                </ul>
                            </li>
                        ))}
                </ul>
                {selectedList && selectedList.length > 0 && (
                    <motion.div
                        className="w-[184px] h-[412px] mb-4 pt-3 pl-3"
                        initial={{ opacity: 0, x: 5 }} // start from right
                        animate={{ opacity: 1, x: 0 }} // animate to left
                        exit={{ opacity: 0, x: 0 }} // exit to right
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="h-full pt-3 pl-3 overflow-y-auto border border-gray-300">
                            <div className="mb-2 text-sm font-medium">
                                <span>Đã chọn</span>
                                <span className="px-2 py-1 ml-1 text-xs rounded bg-tertiary text-secondary">
                                    {`${selectedList.length}/100`}
                                </span>
                            </div>
                            {selectedList.map((item) => (
                                <Person
                                    kind="secondary"
                                    key={uuidv4()}
                                    fullName={item.full_name}
                                    onClick={() => handleRemovePerson(item)}
                                    avatar={item.avatar}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchPerson;
