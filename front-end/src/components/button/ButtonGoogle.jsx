/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../common/ErrorComponent";
const ButtonGoogle = ({ text = "", onClick = () => {} }) => {
    return (
        <button
            className="flex items-center justify-center w-full py-3 mb-5 text-base font-semibold border gap-x-3 border-strock rounded-xl text-text2 dark:text-white dark:border-text3"
            onClick={onClick}
        >
            <img srcSet="/icon-google.png 2x" alt="icon-google" />
            <span>{text}</span>
        </button>
    );
};
ButtonGoogle.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
};
export default withErrorBoundary(ButtonGoogle, {
    FallbackComponent: ErrorComponent,
});
