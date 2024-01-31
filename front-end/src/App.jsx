import PropTypes from 'prop-types'
import Friends from './modules/friends/Friends'
import { TabFriendsProvider } from './context/tabFriendsContext'
function App({ children }) {
	return (
		<TabFriendsProvider>
			<Friends />
		</TabFriendsProvider>
	)
}

App.propTypes = {
	children: PropTypes.node.isRequired,
}

export default App
