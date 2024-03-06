import { IconAddGroup, IconClock } from "../../../../components/icons";
import PropTypes from "prop-types";

const InfoOption = ({ number }) => {
    return (
        <div className="flex flex-col w-full h-[96px] text-text1 text-sm font-normal border-b-8">
            <button className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4">
                <IconClock />
                <span>Danh sách nhắc hẹn</span>
            </button>
            <button className="flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4">
                <IconAddGroup />
                <span>{`${number} nhóm chung`}</span>
            </button>
        </div>
    );
};

InfoOption.propTypes = {
    number: PropTypes.number.isRequired,
};

export default InfoOption;
