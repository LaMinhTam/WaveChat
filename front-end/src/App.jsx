import PropTypes from "prop-types";
import Friends from "./modules/friends/Friends";
function App({ children }) {
    return <div>
        <Friends/>
    
    </div>;
}

App.propTypes = {
    children: PropTypes.node.isRequired,
};

export default App;
