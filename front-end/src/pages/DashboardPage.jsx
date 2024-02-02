import { TabFriendsProvider } from '../context/tabFriendsContext'
import Friends from '../modules/friends/Friends'
import RequiredAuthPage from './RequiredAuthPage'

const DashboardPage = () => {
	return (
		<RequiredAuthPage>
			<TabFriendsProvider>
				<Friends />
			</TabFriendsProvider>
			<div className="flex items-center justify-center translate-y-1/2">
				{/* <WelcomeComp>

                </WelcomeComp> */}
			</div>
		</RequiredAuthPage>
	)
}

const WelcomeComp = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-y-10">
			<div className="flex flex-col items-center justify-center gap-y-2 w-[600px]">
				<h1 className="text-2xl font-normal">
					Chào mừng đến với <strong>Wave Chat!</strong>
				</h1>
				<p className="text-center text-wrap">
					Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu
					hóa trên máy tính của bạn.
				</p>
			</div>
			<div className="w-[380px] h-[228px]">
				<img src="/dashboard_welcome.png" alt="" className="object-cover w-full h-full" />
			</div>
		</div>
	)
}

export default DashboardPage
