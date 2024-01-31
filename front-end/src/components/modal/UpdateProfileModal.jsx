import { useState } from "react";
import { IconBack, IconClose } from "../icons";
import Radio from "../radio";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateProfileModal = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <div className="w-[400px] h-full flex flex-col">
            <div className="flex items-center w-full h-[48px]">
                <button className="flex items-center justify-center w-8 h-8 mb-1 mr-2 rounded-full hover:bg-text2 hover:bg-opacity-10">
                    <IconBack />
                </button>
                <span className="text-[16px] font-semibold mr-auto">
                    Cập nhật thông tin cá nhân
                </span>
                <button
                    // onClick={() => setShowProfileDetails(false)}
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                >
                    <IconClose />
                </button>
            </div>
            <hr className="w-full h-[1px] bg-[#eaedf0]" />
            <div className="w-full h-[368px]">
                <div className="px-4 py-3 text-sm font-normal">
                    <span>Tên hiển thị</span>
                    <input
                        type="text"
                        className="w-full px-3 focus:border-[#3989ff] border border-text4 py-2 rounded mt-1"
                        defaultValue={`Võ Đình Thông`}
                    />
                </div>
                <div className="px-4 py-3">
                    <p className="text-[16px] font-medium pb-5">
                        Thông tin cá nhân
                    </p>
                    <div className="flex items-center ml-2 gap-x-10">
                        <div className="flex items-center gap-x-3">
                            <Radio defaultChecked={true} name={`gender`} />
                            <span>Nam</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <Radio name={`gender`} />
                            <span>Nữ</span>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 gap-y-2">
                        <span>Ngày sinh</span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat={`dd/MM/yyyy`}
                            className="focus:border-[#3989ff] border border-text4 rounded mt-1 py-2 px-2"
                        />
                    </div>
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#eaedf0]" />
            <div className="flex items-center justify-center w-full px-4 py-2">
                <div className="flex items-center justify-center ml-auto gap-x-2">
                    <button className="px-4 py-2 font-medium rounded text-text1 bg-text2 bg-opacity-10 hover:bg-opacity-20">
                        Hủy
                    </button>
                    <button className="px-4 py-2 font-medium rounded text-lite bg-primary disabled:bg-opacity-50 hover:bg-opacity-80">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
