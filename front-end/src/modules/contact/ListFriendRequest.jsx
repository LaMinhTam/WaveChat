import { IconLetter } from "../../components/icons";

const ListFriendRequest = () => {
    return (
        <div className="h-screen font-medium border">
            <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
                <IconLetter />
                <span className="px-[14px]">Danh sách kết bạn</span>
            </div>
        </div>
    );
};

export default ListFriendRequest;
