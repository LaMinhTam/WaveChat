import PropTypes from "prop-types";
function App({ children }) {
    return <div>{children}</div>;
}

App.propTypes = {
    children: PropTypes.node.isRequired,
};

export default App;
