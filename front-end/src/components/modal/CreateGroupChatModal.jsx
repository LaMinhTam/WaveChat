import SearchPerson from "../../modules/chat/group/create/SearchPerson";
import { IconCamera, IconClose } from "../icons";

const CreateGroupChatModal = () => {
    return (
        <div>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">Tạo nhóm</span>
                <button className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10">
                    <IconClose />
                </button>
            </div>
            <div className="border border-t-2 border-gray-300">
                <div className="flex items-center justify-center h-20 px-4 gap-x-2">
                    <button className="flex items-center justify-center w-[48px] h-[48px] rounded-full border border-text3">
                        <IconCamera />
                    </button>
                    <input
                        type="text"
                        placeholder="Nhập tên nhóm..."
                        className="flex-1 h-10 px-2 border-b border-gray-300 focus:outline-none focus:border-secondary"
                    />
                </div>
                <SearchPerson />
                <div className="py-[14px] px-4 flex items-center">
                    <div></div>
                    <div className="flex items-center ml-auto gap-x-3">
                        <button className="px-4 py-2 bg-[#eaedf0]">Hủy</button>
                        <button className="px-4 py-2 bg-secondary text-lite">
                            Tạo nhóm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CreateGroupChatModal;
