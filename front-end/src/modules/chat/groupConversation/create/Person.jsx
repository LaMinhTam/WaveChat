import PropTypes from "prop-types";
import { IconClose } from "../../../../components/icons";
import s3ImageUrl from "../../../../utils/s3ImageUrl";
const Person = ({
    avatarName,
    isChecked,
    kind = "primary",
    inputName,
    fullName,
    onClick = () => {},
}) => {
    const avatar = s3ImageUrl(avatarName, inputName);
    return (
        <>
            {kind === "primary" && (
                <div className="flex items-center p-2 rounded select-none hover:bg-gray-100">
                    <input
                        id={inputName}
                        name={inputName}
                        type="checkbox"
                        checked={isChecked}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded input-checkbox text-secondary focus:ring-secondary"
                        onChange={onClick}
                    />
                    <label
                        htmlFor={inputName}
                        className="w-full text-sm font-medium text-gray-900 rounded ms-2"
                    >
                        <div className="flex items-center gap-x-3">
                            <div className="w-10 h-10 rounded-full">
                                <img
                                    src={avatar}
                                    alt={fullName}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>
                            <span>{fullName}</span>
                        </div>
                    </label>
                </div>
            )}
            {kind === "secondary" && (
                <div className="px-3 rounded-full bg-tertiary h-[32px] flex items-center justify-center mr-3 mb-2">
                    <div className="flex items-center justify-center mr-auto">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full">
                            <img
                                src={avatar}
                                alt={fullName}
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                        <span className="text-xs font-medium text-gray-900 ms-2 line-clamp-1">
                            {fullName}
                        </span>
                    </div>
                    <button
                        className="btn-remove__checked w-[18px] h-[18px] flex items-center justify-center bg-secondary rounded-full flex-shrink-0 text-lite"
                        onClick={onClick}
                    >
                        <IconClose />
                    </button>
                </div>
            )}
        </>
    );
};
Person.propTypes = {
    avatarName: PropTypes.string,
    isChecked: PropTypes.bool,
    kind: PropTypes.string,
    inputName: PropTypes.string,
    fullName: PropTypes.string,
    onClick: PropTypes.func,
};

export default Person;
