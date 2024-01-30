import React from 'react'
import Heading from './Heading'
import Avatar from './Avatar'
import Button from './Button'

const FriendInfo = ({props}) => {

  const {listRequest} = props;

  console.log(listRequest);

  
  return (
    <div className='min-w-80 max-w-96   bg-white p-4'>
        <div className='flex p-2 gap-2'>
            <Avatar src={"https://inkythuatso.com/uploads/thumbnails/800/2022/05/anh-meo-che-anh-meo-bua-15-31-09-19-00.jpg"}/>
            <div className='flex-1'>
                <Heading text="Thúy Vy"/>
                <p>26/11/20 - Từ...</p>
                
                
            </div>
            
        </div>
        <div className='p-5 border-solid border border-black-800'>
                    <p>Hêhhehe</p>
        </div>
        <div className='flex gap-1 py-2'>
            <Button text={"Đồng ý"}/>
            <Button text={"Từ chối"}/>
        </div>


        {/* <ul>
          {
            listRequest.map(request => (
              <li key={request.id}>{}</li>
            ))
          }
        </ul> */}

    </div>
  )
}

export default FriendInfo