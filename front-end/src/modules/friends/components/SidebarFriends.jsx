
import React from 'react'
import { Search } from '@mui/icons-material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Heading from './Heading';


const SideBarFriends = () => {
	return (
        <div className='w-full bg-white'>
            <div className='p-5 flex items-center gap-2'>
                
                <div className='flex flex-1 justify-center  border-solid border-2 border-black-100 p-1 rounded-lg'>
                    <Search/>
                    <input type="text" placeholder='Tìm kiếm' className='flex-1'/>
                </div>
                <PersonAddIcon />
                <Search/>
            </div>

            <div className='px-4'>
                <div className='p-4 flex items-center gap-4 hover:bg-gray-200' >
                    <Search/>
                    <Heading text='Danh sách bạn bè'/>
                </div>

                <div className='p-4 flex items-center gap-4 hover:bg-gray-200' >
                    <Search/>
                    <Heading text='Danh sách bạn bè'/>
                </div>

                <div className='p-4 flex items-center gap-4 hover:bg-gray-200' >
                    <Search/>
                    <Heading text='Danh sách bạn bè'/>
                </div>
                
                

                
                
            </div>



        </div>
    )
}

export default SideBarFriends
