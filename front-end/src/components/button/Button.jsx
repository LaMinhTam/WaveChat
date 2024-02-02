/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import ErrorComponent from "../common/ErrorComponent";

const Button = ({
    type = "button",
    children,
    className = "",
    isLoading = false,
    href = "",
    kind = "",
    ...rest
}) => {
    const child = isLoading ? (
        <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent border-b-transparent animate-spin"></div>
    ) : (
        children
    );
    let defaultClassName =
        "min-h-[56px] flex items-center justify-center p-4 text-base font-semibold rounded-xl";
    switch (kind) {
        case "primary":
            defaultClassName = defaultClassName + " bg-primary text-white";
            break;
        case "secondary":
            defaultClassName = defaultClassName + " bg-secondary text-white";
            break;
        case "ghost":
            defaultClassName =
                defaultClassName + " text-secondary bg-secondary bg-opacity-10";
            break;

        default:
            break;
    }
    if (href) {
        return (
            <Link to={href} className={classNames(defaultClassName, className)}>
                {child}
            </Link>
        );
    }
    return (
        <button
            className={classNames(
                defaultClassName,
                isLoading ? "opacity-50 pointer-events-none" : "",
                className
            )}
            type={type}
            {...rest}
        >
            {child}
        </button>
    );
};
Button.propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    href: PropTypes.string,
    kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default withErrorBoundary(Button, { FallbackComponent: ErrorComponent });
