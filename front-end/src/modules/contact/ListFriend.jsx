import IconUser from "../../components/icons/IconUser";
import HeaderSearch from "./HeaderSearch";

const ListFriend = () => {
    return (
        <div className="h-screen font-medium border">
            <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
                <IconUser />
                <span className="px-[14px]">Danh sách bạn bè</span>
            </div>
            <div className="w-full h-full px-4 bg-text6">
                <div className="w-full h-[64px] text-sm flex items-center">
                    <span>Bạn bè (1)</span>
                </div>
                <div className="w-full h-full px-4 bg-lite">
                    <div className="w-full h-[64px] flex items-center justify-center gap-x-2">
                        <HeaderSearch text={"Tìm bạn"} />
                    </div>
                    <div>
                        <div className="w-full h-[32px] flex items-center">
                            <span>A</span>
                        </div>
                        <div>
                            <div className="w-full h-[72px] flex items-center gap-x-2 hover:bg-text6 px-4">
                                <div className="w-[40px] h-[40px] rounded-full">
                                    <img
                                        className="object-cover w-full h-full rounded-full"
                                        src="https://source.unsplash.com/random"
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span>Ngoc Anh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListFriend;
