import { useState } from "react";
import { IconHorizontalMore } from "../../components/icons";
import PropTypes from "prop-types";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { useSelector } from "react-redux";

const UserFriend = ({ user, onClick = () => {} }) => {
    const [isHover, setIsHover] = useState(false);
    const activeName = useSelector((state) => state.common.activeName);
    const isActive = user.nick_name === activeName;
    if (!user) return null;
    return (
        <div
            className={`flex items-center gap-x-2 min-h-[74px] h-full w-full cursor-pointer ${
                isActive ? "bg-tertiary" : "hover:bg-text4 hover:bg-opacity-10 "
            }`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
        >
            <div className="flex items-center justify-center gap-x-3">
                <div className="w-[48px] h-[48px] rounded-full ml-2">
                    <img
                        src={s3ImageUrl(user.avatar, user.user_id)}
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{user.nick_name}</span>
                    <span className="text-sm text-text3">Hello</span>
                </div>
            </div>
            <div className="pb-3 pr-3 ml-auto">
                {isHover ? (
                    <IconHorizontalMore />
                ) : (
                    <span className="text-sm">3 giờ</span>
                )}
            </div>
        </div>
    );
};

UserFriend.propTypes = {
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default UserFriend;
