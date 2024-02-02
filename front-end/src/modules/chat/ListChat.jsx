import DashboardSearch from '../dashboard/DashboardSearch'
import { useSelector } from 'react-redux'
import ListUser from './ListUser'
import SideBarFriends from '../friends/components/SidebarFriends'

const ListChat = () => {
	const currentTab = useSelector((state) => state.chat.currentTab)
	return (
		<div className="flex flex-col w-[344px]">
			<DashboardSearch />
			{currentTab === 'Chat' && (
				<div className="flex flex-col items-center w-full h-screen overflow-scroll border border-text4 custom-scrollbar">
					{Array.from({ length: 27 }).map((item, index) => (
						<ListUser key={index} />
					))}
				</div>
			)}

			{currentTab === 'Contact' && <SideBarFriends />}
		</div>
	)
}

export default ListChat
