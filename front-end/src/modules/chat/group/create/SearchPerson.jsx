import { useEffect, useState } from "react";
import { IconSearch } from "../../../../components/icons";
import { useChat } from "../../../../contexts/chat-context";
import Person from "./Person";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { axiosPrivate } from "../../../../api/axios";

const SearchPerson = () => {
    const [removedInputId, setRemovedInputId] = useState("");
    const { selectedList, setSelectedList } = useChat();
    const [phone, setPhone] = useState("");
    const listFriend = useSelector((state) => state.user.listFriend);
    const [searchResult, setSearchResult] = useState({});
    const conversations = useSelector(
        (state) => state.conversation.conversations
    );
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
        async function fetchUserByPhone() {
            try {
                const response = await axiosPrivate.get(
                    `/user/find-phone?phone=${phone}`
                );
                const data = response.data.data.user;
                if (data) {
                    setSearchResult({
                        ...data,
                        user_id: data._id,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (phone.length === 10) {
            fetchUserByPhone();
        }
    }, [phone, setSelectedList]);

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
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                </div>
                <div>
                    {searchResult && phone.length === 10 && (
                        <li key={uuidv4()}>
                            <Person
                                inputName={searchResult._id}
                                fullName={searchResult.full_name}
                                onClick={() => {
                                    handleSelectPerson(searchResult);
                                    setPhone("");
                                    setSearchResult({});
                                }}
                                avatar={searchResult.avatar}
                            />
                        </li>
                    )}
                </div>
            </div>
            <div className="flex items-center px-4 py-2 border-t border-gray-300">
                <ul className="px-3 pb-3 overflow-y-auto text-sm text-gray-700 h-[400px] dark:text-gray-200 mr-3 flex-1">
                    <span className="text-sm font-medium">
                        Trò chuyện gần đây
                    </span>
                    {conversations.map((item) => (
                        <li key={uuidv4()}>
                            <Person
                                inputName={item._id}
                                fullName={item.name}
                                onClick={() => handleSelectPerson(item)}
                                isChecked={selectedList.some(
                                    (user) => user.user_id === item._id
                                )}
                                avatar={item.avatar}
                            />
                        </li>
                    ))}
                    {listFriend.map((item) => (
                        <li key={uuidv4()}>
                            <Person
                                inputName={item.user_id}
                                fullName={item.full_name}
                                onClick={() => handleSelectPerson(item)}
                                isChecked={selectedList.some(
                                    (user) => user.user_id === item.user_id
                                )}
                                avatar={item.avatar}
                            />
                        </li>
                    ))}
                </ul>
                {selectedList && selectedList.length > 0 && (
                    <div className="w-[184px] h-[412px] mb-4 pt-3 pl-3">
                        <div className="h-full pt-3 pl-3 overflow-y-auto border border-gray-300">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPerson;
