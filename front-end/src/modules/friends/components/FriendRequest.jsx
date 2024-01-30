import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import FriendInfo from './FriendInfo'
import axios from 'axios'



const FriendRequest = () => {

  const [requests, setRequest] = useState([])

  // useEffect(() =>{
    
  //   async function fetchFriendList() {
  //     const requestUrl = `http://localhost:3000/friend?type=2`;
  //     const response = await fetch(requestUrl)
  //     const responseJSON = await response.json()
  //     console.log({responseJSON});
  //   }

  //   fetchFriendList()
  // }, [])

  async function getRequests(accessToken){
    const res = await axios.get('http://localhost:3000/friend?type=2', 
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        
        "Content-Type": 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
    )
    return res.data
  }

  console.log(getRequests('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI5MTk2ZGYzYzY1ZWU0ZjVjZmNlYjYiLCJyb2xlIjoidXNlciIsImZ1bGxfbmFtZSI6InRodXl2eSIsImF2YXRhciI6IiIsImlhdCI6MTcwNjYzMDEyMywiZXhwIjoxNzA3MjM0OTIzfQ.W_t5bsBSOYONxdjL6LNZBfsvtWjVWifueAUUQS01Xx0'));


  return (
    <div>
        <div className='p-4 fixed w-full border-solid border-b border-black-100'>
            <Heading text="Lời mời kết bạn"/>
            <div className='flex gap-2 flex-wrap'>
                {/* <FriendInfo/>
                <FriendInfo/>
                <FriendInfo/> */}
            </div>
        </div>
    </div>
  )
}

export default FriendRequest