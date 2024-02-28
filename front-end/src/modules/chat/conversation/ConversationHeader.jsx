import { IconAddGroup, IconSplit } from "../../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../../utils/s3ImageUrl";

const ConversationHeader = ({ name, status, avatar, userId }) => {
    return (
        <div className="flex items-center justify-center px-4 min-h-[68px] bg-lite shadow-md">
            <div className="flex items-center justify-center mr-auto gap-x-2">
                <div className="w-[48px] h-[48px] rounded-full">
                    <img
                        src={s3ImageUrl(avatar, userId)}
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <span className="text-sm font-normal text-text3">
                        {status}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2">
                <IconAddGroup />
                <IconSplit />
            </div>
        </div>
    );
};

ConversationHeader.propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    avatar: PropTypes.string,
    userId: PropTypes.string,
};

export default ConversationHeader;
