import { IconAddGroup, IconAddUser, IconSearch } from "../../components/icons";

const DashboardSearch = () => {
    return (
        <div className="flex flex-col min-w-[334px] w-full border border-text4">
            <div className="flex flex-col w-full pl-4">
                <div className="flex items-center justify-center gap-x-[17px] mb-4 mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-[240px] h-[32px] rounded-md border pl-10"
                            placeholder="Tìm kiếm"
                        />
                        <span className="absolute left-[6px] top-[6px]">
                            <IconSearch />
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="w-[32px] h-[32px] flex items-center justify-center">
                            <IconAddUser />
                        </button>
                        <button className="w-[32px] h-[32px] flex items-center justify-center">
                            <IconAddGroup />
                        </button>
                    </div>
                </div>
                <div className="flex items-center text-sm gap-x-5">
                    <button
                        className="flex text-primary after:w-10
                    after:h-[2px] after:bg-primary after:left-[80px] after:top-[82px] after:absolute"
                    >
                        <span>Tất cả</span>
                    </button>
                    <button className="">
                        <span>Chưa đọc</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardSearch;
