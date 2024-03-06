import {
    IconAddGroup,
    IconBell,
    IconEdit,
    IconPin,
} from "../../../../components/icons";
import PropTypes from "prop-types";

const InfoUser = ({ name }) => {
    return (
        <div className="flex flex-col items-center px-4 py-3 border-b-8">
            <div className="my-3 rounded-full w-14 h-14">
                <img
                    src="https://source.unsplash.com/random"
                    alt=""
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex items-center justify-center">
                <span className="text-lg font-medium">{name}</span>
                <button className="flex items-center justify-center w-6 h-6 ml-4 rounded-full bg-text6">
                    <span className="flex items-center justify-center w-4 h-4">
                        <IconEdit />
                    </span>
                </button>
            </div>
            <div className="flex items-center justify-center w-[310px] h-[90px] pt-3">
                <div className="flex flex-col items-center">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
                        <span className="flex items-center justify-center w-5 h-5">
                            <IconBell />
                        </span>
                    </button>
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        Tắt thông báo
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
                        <span className="flex items-center justify-center w-5 h-5">
                            <IconPin />
                        </span>
                    </button>
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        Ghim hội thoại
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-text6">
                        <span className="flex items-center justify-center w-5 h-5">
                            <IconAddGroup />
                        </span>
                    </button>
                    <span className="px-2 py-1 text-xs font-normal text-center text-text7 text-wrap w-[84px]">
                        Tạo nhóm trò chuyện
                    </span>
                </div>
            </div>
        </div>
    );
};

InfoUser.propTypes = {
    name: PropTypes.string.isRequired,
};

export default InfoUser;
