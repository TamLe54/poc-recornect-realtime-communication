import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { useEffect, useState } from 'react'
import { METHOD_NAMES } from '../constants'
import { TMessage } from '../types'
import { RoomContent } from './room-content'
import { RoomSearch } from './room-search'

type TChatRoom = {
  username: string
  connection: HubConnection
}

export const ChatSpace = ({ username, connection }: TChatRoom) => {
  const [currentRoom, setCurrentRoom] = useState<string>('')
  const [allMessages, setAllMessages] = useState<TMessage[]>([])
  const handleSetRoom = (room: string) => setCurrentRoom(room)
  const handleAddMessage = (message: TMessage) => {
    setAllMessages((prev) => [...prev, message])
  }

  useEffect(() => {
    if (connection.state === HubConnectionState.Connected)
      connection.on(
        METHOD_NAMES.RECEIVE_MESSAGE,
        (
          userName: string,
          message: string,
          receivedRoom: string,
          status: boolean
        ) => {
          handleAddMessage({
            user: userName,
            message,
            room: receivedRoom,
            status,
          })
        }
      )

    return () => {
      connection.off(METHOD_NAMES.RECEIVE_MESSAGE)
    }
  }, [currentRoom, connection])

  const getMessagesByRoom = (room: string) => {
    return allMessages.filter(
      (message) => message.room === room && message.status === true
    )
  }

  return (
    <div className='w-full h-[500px] max-h-fit flex gap-5'>
      <div className='flex-[33%] h-full'>
        <RoomSearch
          username={username}
          connection={connection}
          currentRoom={currentRoom}
          setCurrentRoom={handleSetRoom}
        />
      </div>
      <div className='flex-[67%] h-full rounded-md shadow-md'>
        <RoomContent
          username={username}
          connection={connection}
          currentRoom={currentRoom}
          messages={getMessagesByRoom(currentRoom)}
        />
      </div>
    </div>
  )
}
