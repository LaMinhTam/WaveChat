import React from 'react'
import Heading from './Heading'

const Button = ({ text }) => {
	return (
		<div className="flex justify-center items-center bg-gray-200 w-full p-2 rounded-md hover:bg-gray-300">
			<button>
				<Heading text={text} />
			</button>
		</div>
	)
}

export default Button
