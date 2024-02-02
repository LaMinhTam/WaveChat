import React, { useEffect, useState } from 'react'
import Heading, { Heading2 } from './Heading'
import axios from 'axios'
import FriendReceived from './FriendReceived'
import FriendSent from './FriendSent'
import DraftsIcon from '@mui/icons-material/Drafts'
import { getToken } from '../../../utils/auth'

const FriendRequest = () => {
	const acceskey = getToken()

	const [friendrequests, setFriendRequests] = useState([])
	const [requestssent, setRequestsent] = useState([])

	useEffect(() => {
		async function fetchFriendRequests(accessToken) {
			try {
				const res = await axios.get('http://localhost:3000/friend?type=2', {
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				})

				// Access the array of friend requests
				const friendRequestsArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data]

				console.log(friendRequestsArray)
				return friendRequestsArray
			} catch (error) {
				console.error('Error fetching friend requests:', error)
				return []
			}
		}

		// Use the async function with await or .then()
		async function fetchData() {
			try {
				const list = await fetchFriendRequests(acceskey)
				setFriendRequests(list)
			} catch (error) {
				console.error('Error setting friend requests sent:', error)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		async function fetchFriendRequests(accessToken) {
			try {
				const res = await axios.get('http://localhost:3000/friend?type=3', {
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				})

				// Access the array of friend requests
				const friendRequestsArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data]

				console.log(friendRequestsArray)
				return friendRequestsArray
			} catch (error) {
				console.error('Error fetching friend requests:', error)
				return []
			}
		}

		// Use the async function with await or .then()
		async function fetchData() {
			try {
				const list = await fetchFriendRequests(acceskey)
				setRequestsent(list)
			} catch (error) {
				console.error('Error setting friend requests sent:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<div>
			<div className=" fixed w-full border-solid border-b border-black-100"></div>
			<div className="flex gap-3 py-6 px-4 flex items-center border-solid border-b border-black-900 bg-white">
				<DraftsIcon />
				<Heading text="Lời mời kết bạn" />
			</div>

			<div className="flex gap-2 flex-wrap p-4">
				<div className="w-full">
					<Heading2 text={`Lời mời đã nhận (${friendrequests.length})`} />
				</div>

				<div className="w-full flex gap-4">
					{friendrequests.map((request) => (
						<FriendReceived request={request} key={request.user_id} />
					))}
				</div>
			</div>

			<div className="flex gap-2 flex-wrap p-4">
				<div className="w-full">
					<Heading2 text={`Lời mời đã gửi (${requestssent.length})`} />
				</div>

				<div className="w-full flex gap-4">
					{requestssent.map((request) => (
						<FriendSent request={request} key={request.user_id} />
					))}
				</div>
			</div>
		</div>
	)
}

export default FriendRequest
