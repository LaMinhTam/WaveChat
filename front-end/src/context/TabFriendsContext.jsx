import { createContext, useContext, useState } from 'react'

const TabFriendsContext = createContext()

export const TabFriendsProvider = ({ children }) => {
	const [currentTab, setCurrentTab] = useState('Danh sách bạn bè')

	const changeTab = (tab) => {
		setCurrentTab(tab)
	}

	return (
		<TabFriendsContext.Provider value={{ currentTab, changeTab }}>
			{children}
		</TabFriendsContext.Provider>
	)
}

export const useTabFriendsContext = () => {
	return useContext(TabFriendsContext)
}
