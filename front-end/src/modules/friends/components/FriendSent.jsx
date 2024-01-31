import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Avatar from './Avatar'
import Button from './Button'
import axios from 'axios'

const FriendSent = ({ request }) => {
	// console.log(request);

	const [user, setUser] = useState(null)

	useEffect(() => {
		async function fetchUser(accessToken) {
			try {
				const res = await axios.get(`http://localhost:3000/user/profile?_id=${request.user_id}`, {
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				})

				// Access the array of friend requests

				return res.data.data
			} catch (error) {
				console.error('Error fetching user:', error)
				return null
			}
		}

		// Use the async function with await or .then()
		async function fetchData() {
			try {
				const data = await fetchUser(
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI5MTk2ZGYzYzY1ZWU0ZjVjZmNlYjYiLCJyb2xlIjoidXNlciIsImZ1bGxfbmFtZSI6InRodXl2eSIsImF2YXRhciI6IiIsImlhdCI6MTcwNjY5NDk3MSwiZXhwIjoxNzA3Mjk5NzcxfQ.rlIyqdARfzuMXEqwayDSAivioF6W87bDV9tEoZ11Mgc'
				)
				setUser(data)
			} catch (error) {
				console.error('Error setting friend requests:', error)
			}
		}

		fetchData()
	}, [])

	console.log(user)

	if (!user) return null

	return (
		<div className="min-w-80 max-w-96   bg-white p-4">
			<div className="flex p-2 gap-2">
				<Avatar
					src={
						'https://inkythuatso.com/uploads/thumbnails/800/2022/05/anh-meo-che-anh-meo-bua-15-31-09-19-00.jpg'
					}
				/>
				<div className="flex-1">
					<Heading text={user.full_name} />
					<p>26/11/20 - Từ...</p>
				</div>
			</div>
			<div className="p-5 border-solid border border-black-800">
				<p>Hêhhehe</p>
			</div>
			<div className="flex gap-1 py-2">
				<Button text={'Thu hồi lời mời'} />
			</div>
		</div>
	)
}

export default FriendSent
