import { HubConnection } from '@microsoft/signalr'
import { Button, Input, List, Typography } from 'antd'
import { useState } from 'react'
import { METHOD_NAMES } from '../constants'

type TChatRoom = {
  username: string
  connection: HubConnection
  currentRoom: string
  setCurrentRoom: (room: string) => void
}

export const RoomSearch = ({
  username,
  connection,
  currentRoom,
  setCurrentRoom,
}: TChatRoom) => {
  const [joinedRooms, setJoinedRooms] = useState<string[]>([])
  const [roomInput, setRoomInput] = useState<string>('')

  const handleJoinRoom = async (
    connection: HubConnection,
    room: string,
    username: string,
    rejoin: boolean = false
  ) => {
    if (room) {
      const userConnection = {
        User: username,
        Room: room,
      }

      try {
        await connection.invoke(METHOD_NAMES.JOIN_ROOM, userConnection, false)
        if (!rejoin)
          setJoinedRooms((prev) => {
            if (prev.some((existingRoom) => existingRoom === room)) {
              return prev
            }
            return [...prev, room]
          })
        setCurrentRoom(room)
        if (roomInput) setRoomInput('')
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <>
      <div className='w-full flex gap-2'>
        <Input
          placeholder='Enter the room'
          size='large'
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <Button
          type='primary'
          size='large'
          onClick={() => {
            handleJoinRoom(connection, roomInput, username)
          }}>
          Go
        </Button>
      </div>
      <div className='w-full h-[90%] mt-5  flex flex-col gap-5 overflow-y-auto'>
        <List
          bordered
          dataSource={joinedRooms}
          renderItem={(room) => (
            <List.Item
              style={{
                border: room === currentRoom ? '2px solid #5A7C5A' : '',
              }}
              className='select-none cursor-pointer rounded-md'
              onClick={() => {
                if (room !== currentRoom)
                  handleJoinRoom(connection, room, username, true)
              }}>
              <Typography.Text> {room}</Typography.Text>
            </List.Item>
          )}
        />
      </div>
    </>
  )
}
