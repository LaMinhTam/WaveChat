// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useSelector } from 'react-redux'
import { useTabFriendsContext } from '../contexts/TabFriendsContext'
import Conversation from '../modules/chat/Conversation'
import Friends from '../modules/friends/Friends'
import FriendRequest from '../modules/friends/components/FriendRequest'
import RequiredAuthPage from './RequiredAuthPage'

const DashboardPage = () => {
	const { currentTabFriend, setCurrentTabFriend } = useTabFriendsContext()
	const currentTab = useSelector((state) => state.chat.currentTab)

	return (
		<RequiredAuthPage>
			{/* <DashboardWelcome /> */}
			{/* <Conversation /> */}
			{currentTab === 'Contact' && <Friends />}
		</RequiredAuthPage>
	)
}
export default DashboardPage
