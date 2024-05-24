import PropTypes from "prop-types";
import classNames from "../../utils/classNames";
const Label = ({ children, htmlFor = "", className = "" }) => {
    return (
        <label
            className={classNames(
                "inline-block self-start text-sm font-medium cursor-pointer dark:text-text3 text-text2",
                className
            )}
            htmlFor={htmlFor}
        >
            {children}
        </label>
    );
};
Label.propTypes = {
    children: PropTypes.node,
    htmlFor: PropTypes.string,
    className: PropTypes.string,
};

export default Label;
