import PropTypes from "prop-types";

const Radio = ({ name, defaultChecked, value, checked, ...props }) => {
    return (
        <input
            type="radio"
            name={name}
            defaultChecked={defaultChecked}
            value={value}
            checked={checked}
            {...props}
        />
    );
};

Radio.propTypes = {
    name: PropTypes.string.isRequired,
    defaultChecked: PropTypes.bool,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
};

export default Radio;
