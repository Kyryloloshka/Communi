import React from 'react'
import { Button } from './ui/button'

const InputText = ({ sendMessage, message, setMessage }: { sendMessage: Function, message: string, setMessage: Function }) => {
  return (
    <div className='flex items-center px-4 pt-2 pb-3 border-t border-dark-5'>
      <span className='text-gray-500 mr-2 cursor-pointer'>file</span>
      <input type="text" placeholder='Type a message' value={message} onChange={e => setMessage(e.target.value)} className='flex-1 py-2 px-3 outline-none border-none rounded-sm'/>
      <Button onClick={() => sendMessage()} className='text-gray-500 ml-2 cursor-pointer'>send</Button>
    </div>
  )
}

export default InputText