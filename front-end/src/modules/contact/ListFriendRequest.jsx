import { IconLetter } from "../../components/icons";
import FriendCard from "./FriendCard";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const ListFriendRequest = () => {
    const listFriendRequest = useSelector(
        (state) => state.friend.listFriendRequest
    );
    const listFriendSendRequest = useSelector(
        (state) => state.friend.listFriendSendRequest
    );
    return (
        <div className="h-screen font-medium border">
            <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
                <IconLetter />
                <span className="px-[14px]">Danh sách kết bạn</span>
            </div>
            <div className="w-full h-full px-4 bg-text6">
                <div>
                    <div className="w-full h-[64px] text-sm flex items-center">
                        <span>
                            Lời mời đã nhận ({listFriendRequest.length})
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {listFriendRequest &&
                            listFriendRequest?.map((item) => (
                                <FriendCard
                                    key={uuidv4()}
                                    data={item}
                                    type="receive"
                                />
                            ))}
                    </div>
                </div>
                <div>
                    <div className="w-full h-[64px] text-sm flex items-center">
                        <span>
                            Lời mời đã gửi ({listFriendSendRequest.length})
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {listFriendSendRequest &&
                            listFriendSendRequest?.map((item) => (
                                <FriendCard
                                    key={uuidv4()}
                                    data={item}
                                    type="request"
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListFriendRequest;
