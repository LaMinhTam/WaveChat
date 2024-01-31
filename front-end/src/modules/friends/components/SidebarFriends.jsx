import React from 'react'
import { Search } from '@mui/icons-material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Heading from './Heading'
import { useTabFriendsContext } from '../../../context/tabFriendsContext'

const SideBarFriends = () => {
	const { currentTab, changeTab } = useTabFriendsContext()

	console.log(currentTab)

	return (
		<div className="w-full bg-white">
			<div className="p-5 flex items-center gap-2">
				<div className="flex flex-1 justify-center  border-solid border-2 border-black-100 p-1 rounded-lg">
					<Search />
					<input type="text" placeholder="Tìm kiếm" className="flex-1" />
				</div>
				<PersonAddIcon />
				<Search />
			</div>

			<div className="px-4">
				<div
					className="p-4 flex items-center gap-4 hover:bg-gray-200"
					onClick={() => changeTab('Danh sách bạn bè')}
				>
					<Search />
					<Heading text="Danh sách bạn bè" />
				</div>

				<div
					className="p-4 flex items-center gap-4 hover:bg-gray-200"
					onClick={() => changeTab('Danh sách nhóm')}
				>
					<Search />
					<Heading text="Danh sách nhóm" />
				</div>

				<div
					className="p-4 flex items-center gap-4 hover:bg-gray-200"
					onClick={() => changeTab('Lời mời kết bạn')}
				>
					<Search />
					<Heading text="Lời mời kết bạn" />
				</div>
			</div>
		</div>
	)
}

export default SideBarFriends
