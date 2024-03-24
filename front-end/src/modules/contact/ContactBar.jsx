import { IconAddGroup, IconLetter } from "../../components/icons";
import IconUser from "../../components/icons/IconUser";

const ContactBar = () => {
    return (
        <div className="h-screen font-medium border">
            <button className="flex items-center w-full h-[56px] px-[18px] hover:bg-text6">
                <IconUser />
                <span className="px-[14px]">Danh sách bạn bè</span>
            </button>
            <button className="flex items-center w-full h-[56px] px-[18px] hover:bg-text6">
                <IconAddGroup />
                <span className="px-[14px]">Danh sách nhóm</span>
            </button>
            <button className="flex items-center w-full h-[56px] px-[18px] hover:bg-text6">
                <IconLetter />
                <span className="px-[14px]">Danh sách kết bạn</span>
            </button>
        </div>
    );
};

export default ContactBar;
