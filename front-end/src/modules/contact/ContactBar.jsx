import { useDispatch, useSelector } from "react-redux";
import { IconAddGroup, IconLetter } from "../../components/icons";
import IconUser from "../../components/icons/IconUser";
import { setContactOption } from "../../store/friendSlice";

const ContactBar = () => {
    const dispatch = useDispatch();
    const contactOption = useSelector((state) => state.friend.contactOption);
    return (
        <div className="h-screen font-medium border">
            <button
                className={`flex items-center w-full h-[56px] px-[18px] ${
                    contactOption === 0
                        ? "bg-tertiary bg-opacity-40"
                        : "hover:bg-text6"
                }`}
                onClick={() => dispatch(setContactOption(0))}
            >
                <IconUser />
                <span className="px-[14px]">Danh sách bạn bè</span>
            </button>
            <button
                className={`flex items-center w-full h-[56px] px-[18px] ${
                    contactOption === 1
                        ? "bg-tertiary bg-opacity-40"
                        : "hover:bg-text6"
                }`}
                onClick={() => dispatch(setContactOption(1))}
            >
                <IconAddGroup />
                <span className="px-[14px]">Danh sách nhóm</span>
            </button>
            <button
                className={`flex items-center w-full h-[56px] px-[18px] ${
                    contactOption === 2
                        ? "bg-tertiary bg-opacity-40"
                        : "hover:bg-text6"
                }`}
                onClick={() => dispatch(setContactOption(2))}
            >
                <IconLetter />
                <span className="px-[14px]">Danh sách kết bạn</span>
            </button>
        </div>
    );
};

export default ContactBar;
