import { IconAddGroup, IconSplit } from "../../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../../utils/s3ImageUrl";

const GroupConversationHeader = ({ groupName, groupMembers, groupAvatar }) => {
    return (
        <div className="flex items-center justify-center px-4 min-h-[68px] bg-lite shadow-md">
            <div className="flex items-center justify-center mr-auto gap-x-2">
                <div className="w-[48px] h-[48px] rounded-full">
                    {/* Display group avatar */}
                    <img
                        src={s3ImageUrl(groupAvatar)} // Assuming groupAvatar is a URL
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div>
                    {/* Display group name */}
                    <h3 className="text-lg font-semibold">{groupName}</h3>
                    {/* Display number of group members */}
                    <span className="text-sm font-normal text-text3">{`${groupMembers.length} members`}</span>
                </div>
            </div>
            {/* Additional group-specific actions/icons */}
            <div className="flex items-center justify-center gap-x-2">
                <IconAddGroup />
                <IconSplit />
            </div>
        </div>
    );
};

GroupConversationHeader.propTypes = {
    groupName: PropTypes.string.isRequired,
    groupMembers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            // You can include more properties if needed
        })
    ).isRequired,
    groupAvatar: PropTypes.string.isRequired,
};

export default GroupConversationHeader;
