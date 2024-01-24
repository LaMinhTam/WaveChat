import PropTypes from "prop-types";
import Modal from "react-modal";
Modal.setAppElement("#root");
Modal.defaultStyles = {};
function App({ children }) {
    return <div>{children}</div>;
}

App.propTypes = {
    children: PropTypes.node.isRequired,
};

export default App;
