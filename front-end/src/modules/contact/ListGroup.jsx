import { IconAddGroup, IconSearch, IconSort } from "../../components/icons";

const ListGroup = () => {
    return (
        // <div className="h-screen font-medium border">
        //     <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
        //         <IconAddGroup />
        //         <span className="px-[14px]">Danh sách nhóm</span>
        //     </div>
        // </div>
        <div className="h-screen font-medium border">
            <div className="flex items-center w-full h-[64px] px-[18px] bg-lite shadow">
                <IconAddGroup />
                <span className="px-[14px]">Danh sách nhóm</span>
            </div>
            <div className="w-full h-full px-4 bg-text6">
                <div className="w-full h-[64px] text-sm flex items-center">
                    <span>Bạn bè (1)</span>
                </div>
                <div className="w-full h-full px-4 bg-lite">
                    <div className="w-full h-[64px] flex items-center justify-center gap-x-2">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-[350px] h-[32px] rounded-md border pl-10"
                                placeholder="Tìm kiếm..."
                            />
                            <span className="absolute left-[6px] top-[6px]">
                                <IconSearch />
                            </span>
                        </div>
                        <div className="relative">
                            <select
                                name="selectSort"
                                id="selectSort"
                                className="w-[350px] h-[32px] rounded-md border pl-10"
                            >
                                <option value="">Tên (A-Z)</option>
                                <option value="">Tên (Z-A)</option>
                            </select>
                            <span className="absolute left-[6px] top-[6px]">
                                <IconSort />
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="w-full h-[72px] flex items-center gap-x-2 hover:bg-text6 px-4 border-b">
                                <div className="w-[40px] h-[40px] rounded-full">
                                    <img
                                        className="object-cover w-full h-full rounded-full"
                                        src="https://source.unsplash.com/random"
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span>Nhóm Công Nghệ Mới</span>
                                    <span className="text-sm text-text4">
                                        10 thành viên
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListGroup;
