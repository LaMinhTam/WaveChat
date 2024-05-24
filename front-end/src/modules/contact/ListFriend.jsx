import IconUser from "../../components/icons/IconUser";
import s3ImageUrl from "../../utils/s3ImageUrl";
import sortedPersonToAlphabet from "../../utils/sortedPersonToAlphabet";
import HeaderSearch from "./HeaderSearch";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const ListFriend = () => {
    const listFriend = useSelector((state) => state.user.listFriend);
    const sortedListFriend = sortedPersonToAlphabet(listFriend);
    return (
        <div className="h-screen font-medium border">
            <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
                <IconUser />
                <span className="px-[14px]">Danh sách bạn bè</span>
            </div>
            <div className="w-full h-full px-4 bg-text6">
                <div className="w-full h-[64px] text-sm flex items-center">
                    <span>Bạn bè ({listFriend?.length})</span>
                </div>
                <div className="w-full h-full px-4 bg-lite">
                    <div className="w-full h-[64px] flex items-center justify-center gap-x-2">
                        <HeaderSearch text={"Tìm bạn"} />
                    </div>
                    {sortedListFriend?.map((group) => (
                        <div key={uuidv4()}>
                            <div className="w-full h-[32px] flex items-center">
                                <span>{group.key}</span>
                            </div>
                            {group.data.map((friend) => (
                                <div key={friend.user_id}>
                                    <div className="w-full h-[72px] flex items-center gap-x-2 hover:bg-text6 px-4">
                                        <div className="w-[40px] h-[40px] rounded-full">
                                            <img
                                                className="object-cover w-full h-full rounded-full"
                                                src={s3ImageUrl(friend?.avatar)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{friend?.full_name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListFriend;
