import { IconMore } from "../../../../components/icons";

const InfoImage = () => {
    return (
        <div className="w-full border-b-8">
            <div className="flex items-center justify-between px-4 py-2">
                <h3>Ảnh/Video</h3>
                <span>
                    <IconMore />
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2 px-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-[72px] h-[72px] rounded-md bg-text6"
                    >
                        <img
                            src="https://source.unsplash.com/random"
                            alt=""
                            className="object-cover w-full h-full rounded-md"
                        />
                    </div>
                ))}
            </div>
            <button className="w-[310px] h-8 px-4 m-4 rounded bg-text6 font-medium">
                Xem tất cả
            </button>
        </div>
    );
};

export default InfoImage;
