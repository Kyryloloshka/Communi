import React from 'react'

const InputText = () => {
  return (
    <div className='flex items-center px-4 pt-2 pb-3 border-t border-dark-5'>
      <span className='text-gray-500 mr-2 cursor-pointer'>file</span>
      <input type="text" placeholder='Type a message' className='flex-1 py-2 px-3 outline-none border-none rounded-sm'/>
      <span className='text-gray-500 ml-2 cursor-pointer'>send</span>
    </div>
  )
}

export default InputText