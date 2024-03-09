import { IconTrash } from "../../../components/icons";
import InfoFile from "./Info/InfoFile";
import InfoHeader from "./Info/InfoHeader";
import InfoImage from "./Info/InfoImage";
import InfoOption from "./Info/InfoOption";
import InfoUser from "./Info/InfoUser";
import PropTypes from "prop-types";

const ConversationInfo = ({ name }) => {
    return (
        <div className="min-w-[344px] h-screen flex flex-col justify-start bg-lite shadow-md overflow-x-hidden overflow-y-scroll custom-scrollbar">
            <InfoHeader />
            <div className="flex-1">
                <InfoUser name={name} />
                <InfoOption number={4} />
                <InfoImage />
                <InfoFile />
                <button className="w-full flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 font-medium text-error">
                    <IconTrash />
                    <span>Xóa lịch sử trò chuyện</span>
                </button>
            </div>
        </div>
    );
};

ConversationInfo.propTypes = {
    name: PropTypes.string,
};

export default ConversationInfo;
