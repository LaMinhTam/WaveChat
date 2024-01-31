import PropTypes from "prop-types";

const Radio = ({
    name,
    defaultChecked,
    value,
    checked,
    onChange,
    ...props
}) => {
    return (
        <input
            type="radio"
            name={name}
            defaultChecked={defaultChecked}
            value={value}
            checked={checked}
            onChange={onChange}
            {...props}
        />
    );
};

Radio.propTypes = {
    name: PropTypes.string.isRequired,
    defaultChecked: PropTypes.bool,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Radio;
