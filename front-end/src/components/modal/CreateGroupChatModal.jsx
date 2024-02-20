import { IconCamera, IconClose, IconSearch } from "../icons";

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
                        className="flex-1 h-10 px-2 border-b border-gray-300 focus:outline-none focus:border-primary"
                    />
                </div>
                <SearchForm />
                <div className="py-[14px] px-4 flex items-center">
                    <div></div>
                    <div className="flex items-center ml-auto gap-x-3">
                        <button className="px-4 py-2 bg-[#eaedf0]">Hủy</button>
                        <button className="px-4 py-2 bg-[#0068ff] text-lite">
                            Tạo nhóm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchForm = () => {
    return (
        <div
            id="dropdownSearch"
            className="z-10 bg-white rounded-lg shadow dark:bg-gray-700"
        >
            <div className="p-3">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        <IconSearch />
                    </div>
                    <input
                        type="text"
                        id="input-group-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                    />
                </div>
            </div>
            <ul className="px-3 pb-3 overflow-y-auto text-sm text-gray-700 h-[400px] dark:text-gray-200">
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
                <li>
                    <Item />
                </li>
            </ul>
        </div>
    );
};

const Item = () => {
    return (
        <div className="flex items-center p-2 rounded hover:bg-gray-100">
            <input
                id="checkbox-item-11"
                name="checkbox-item-11"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
                htmlFor="checkbox-item-11"
                className="w-full text-sm font-medium text-gray-900 rounded select-none ms-2"
            >
                <div className="flex items-center gap-x-3">
                    <div className="w-10 h-10 rounded-full">
                        <img
                            src="https://source.unsplash.com/random"
                            alt=""
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                    <span>La Minh Tâm</span>
                </div>
            </label>
        </div>
    );
};
export default CreateGroupChatModal;
