import ReactDOM from 'react-dom/client'
import './App.scss'
import App from './App.jsx'
import './index.scss'
import 'react-toastify/dist/ReactToastify.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import store from './store/configureStore.js'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import 'react-phone-input-2/lib/style.css'
import { AuthProvider } from './contexts/auth-context.jsx'
import LayoutDashboard from './layout/LayoutDashboard.jsx'
import { ChatProvider } from './contexts/chat-context.jsx'
import { TabFriendsProvider } from './contexts/TabFriendsContext.jsx'

const router = createBrowserRouter([
	{
		element: <LayoutDashboard />,
		children: [
			{
				path: '/',
				element: <DashboardPage />,
			},
		],
	},
	{ path: '/register', element: <RegisterPage /> },
	{ path: '/login', element: <LoginPage /> },
	{ path: '*', element: <NotFoundPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<AuthProvider>
			<ChatProvider>
				<TabFriendsProvider>
					<App>
						<RouterProvider router={router}></RouterProvider>
					</App>
				</TabFriendsProvider>
				<ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
			</ChatProvider>
		</AuthProvider>
	</Provider>
)
