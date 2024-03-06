import { IconMore, IconPdf } from "../../../../components/icons";

const InfoFile = () => {
    return (
        <div className="w-full border-b-8">
            <div className="flex items-center justify-between px-4 py-2">
                <h3>File</h3>
                <span>
                    <IconMore />
                </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-[64px] rounded-md hover:bg-text6 px-4"
                    >
                        <div className="flex items-center justify-between h-full">
                            <div className="flex items-center gap-x-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-text6">
                                    <span className="flex items-center justify-center w-4 h-4">
                                        <IconPdf />
                                    </span>
                                </span>
                                <span className="text-sm font-normal text-text1">
                                    Lập trình Python
                                </span>
                            </div>
                            <span className="text-sm font-normal text-text1">
                                1.2MB
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-[310px] h-8 px-4 m-4 rounded bg-text6 font-medium">
                Xem tất cả
            </button>
        </div>
    );
};

export default InfoFile;
