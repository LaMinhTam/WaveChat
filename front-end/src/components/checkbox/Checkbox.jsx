import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import classNames from "../../utils/classNames";

const Checkbox = ({ control, name = "", children, error = "" }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: false,
    });

    return (
        <div className="flex flex-col justify-center gap-y-2">
            <div className="flex items-start gap-x-5">
                <div
                    className={classNames(
                        "inline-flex items-center justify-center w-5 h-5 border rounded cursor-pointer text-white",
                        field.value
                            ? "bg-primary border-primary"
                            : "border-strock dark:border-text3"
                    )}
                    onClick={() => field.onChange(!field.value)}
                >
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={field.value}
                        name={name}
                        {...field}
                    />
                    <span
                        className={classNames(
                            field.value ? "" : "opacity-0 invisible"
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>
                {children && (
                    <div
                        onClick={() => field.onChange(!field.value)}
                        className="cursor-pointer select-none"
                    >
                        {children}
                    </div>
                )}
            </div>
            {error.length > 0 && (
                <span className="text-sm font-medium pointer-events-none text-error error-input">
                    {error}
                </span>
            )}
        </div>
    );
};

Checkbox.propTypes = {
    error: PropTypes.string,
    control: PropTypes.any.isRequired,
    name: PropTypes.string,
    children: PropTypes.node,
};

export default Checkbox;
