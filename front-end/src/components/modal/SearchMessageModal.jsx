import { useEffect, useState } from "react";
import { useChat } from "../../contexts/chat-context";
import { useSocket } from "../../contexts/socket-context";
import { IconClose } from "../icons";
import s3ImageUrl from "../../utils/s3ImageUrl";
import formatDate from "../../utils/formatDate";

const SearchMessageModal = () => {
    const { setShowSearchMessageModal, searchMessageModalRef, messageRefs } =
        useChat();
    const { message } = useSocket();
    const [result, setResult] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        if (searchValue) {
            const searchResult = message.filter((item) =>
                item.message.toLowerCase().includes(searchValue.toLowerCase())
            );
            setResult(searchResult);
        } else {
            setResult([]);
        }
    }, [searchValue, message]);

    const handleClickMessage = (id) => {
        const messageElement = messageRefs[id]?.current;
        const containerElement = document.getElementById("chat-content");

        if (messageElement && containerElement) {
            // Scroll the container to the top of the selected message
            const topPos =
                messageElement.getBoundingClientRect().top -
                containerElement.getBoundingClientRect().top;
            containerElement.scrollTop = topPos;

            setShowSearchMessageModal(false);
        }
    };

    return (
        <div ref={searchMessageModalRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">Tìm kiếm tin nhắn</span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setShowSearchMessageModal(false);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm tin nhắn"
                    className="w-full py-2 pl-2 pr-8 border rounded-lg bg-lite border-text3 focus:outline-none focus:border-secondary focus:bg-white"
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-semibold">
                        Tin nhắn gần đây
                    </span>
                    <button className="text-secondary">Xem tất cả</button>
                </div>

                <div className="w-full h-[500px] overflow-y-auto overflow-x-hidden">
                    {result.length > 0 &&
                        result.map((item) => (
                            <div
                                className="flex items-center justify-between mt-4 cursor-pointer"
                                key={item._id}
                                onClick={() => handleClickMessage(item._id)}
                            >
                                <div className="flex items-center gap-x-2">
                                    <div className="w-12 h-12 rounded-full">
                                        <img
                                            src={s3ImageUrl(item.user.avatar)}
                                            alt={item.user.full_name}
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {item.user.full_name}
                                        </h3>
                                        <span className="text-text3">
                                            {item.message}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-text3">
                                    {formatDate(item.created_at)}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default SearchMessageModal;
