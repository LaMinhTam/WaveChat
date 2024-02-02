import { useState } from "react";
import { IconHorizontalMore } from "../../components/icons";

const ListUser = () => {
    const [isHover, setIsHover] = useState(false);
    return (
        <div
            className="flex items-center gap-x-2 min-h-[74px] h-full w-full cursor-pointer hover:bg-text4 hover:bg-opacity-10"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="w-[48px] h-[48px] rounded-full flex-shrink-0 ml-2">
                <img
                    src="https://source.unsplash.com/random"
                    alt=""
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex items-start justify-around">
                <div className="flex flex-col mr-[135px]">
                    <span className="text-sm font-bold">Nguyen Van A</span>
                    <span className="text-sm text-text3">Hello</span>
                </div>
                {isHover ? (
                    <IconHorizontalMore />
                ) : (
                    <span className="text-sm">3 giờ</span>
                )}
            </div>
        </div>
    );
};

export default ListUser;
