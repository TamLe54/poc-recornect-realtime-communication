import { HubConnection } from '@microsoft/signalr'
import { Button, Card, Input } from 'antd'
import { useState } from 'react'
import { METHOD_NAMES } from '../constants'
import { TMessage } from '../types'

type TRoomContent = {
  currentRoom: string
  username: string
  connection: HubConnection
  messages: TMessage[]
}

export const RoomContent = ({
  currentRoom,
  username,
  connection,
  messages,
}: TRoomContent) => {
  const [message, setMessage] = useState<string>('')
  const handleClickSendBtn = async () => {
    try {
      await connection.invoke(
        METHOD_NAMES.SEND_MESSAGE,
        message,
        currentRoom,
        true
      )
      if (message) setMessage('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div className='h-full'>
      <div className='box-border h-full p-3 flex flex-col justify-between'>
        <div className='box-border w-full h-[10%] px-5 flex flex-row justify-between border-b-2 border-solid border-0 border-[#5A7C5A]'>
          <h2>{username}</h2>
          <h2>{currentRoom}</h2>
        </div>
        <div className='box-border w-full px-5 py-10 overflow-y-auto flex flex-col gap-3'>
          {messages.map((message, index) => {
            const isMyMessage = message.user === username

            return (
              <div
                className={`w-full flex flex-row ${
                  isMyMessage ? 'justify-end' : 'justify-start'
                }`}
                key={index}>
                <Card title={message.user} bordered={isMyMessage}>
                  <p>{message.message}</p>
                </Card>
              </div>
            )
          })}
        </div>
        <div className='w-full flex flex-row gap-5 justify-around'>
          <Input
            size='large'
            disabled={!currentRoom}
            value={message}
            onChange={handleOnMessageChange}
            type='text'
          />
          <Button
            size='large'
            disabled={!currentRoom || message === ''}
            onClick={() => {
              handleClickSendBtn()
            }}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
