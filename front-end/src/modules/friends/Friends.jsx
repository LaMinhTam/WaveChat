import { TabFriendsProvider, useTabFriendsContext } from '../../context/tabFriendsContext'
import FriendRequest from './components/FriendRequest'
import SideBarFriends from './components/SidebarFriends'

function Friends({ children }) {
	const { currentTab, changeTab } = useTabFriendsContext()

	return (
		<div>
			<div className="flex  w-screen min-h-screen">
				<div className="w-1/4 min-w-80 border-solid border-r border-black-900">
					<SideBarFriends />
				</div>

				<div className="flex-1 bg-gray-100">
					{currentTab === 'Danh sách bạn bè' && <p>Danh sách bạn bè</p>}
					{currentTab === 'Danh sách nhóm' && <p>Danh sách nhóm</p>}
					{currentTab === 'Lời mời kết bạn' && <FriendRequest />}
					{children}
				</div>
			</div>
		</div>
	)
}

export default Friends
