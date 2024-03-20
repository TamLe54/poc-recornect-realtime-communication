import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { Button, Input, InputRef } from 'antd'
import { useRef, useState } from 'react'
import { buildConnection } from '../handle'
import { ChatSpace } from './chat-space'

export const SignalClient = () => {
  const [connection, setConnection] = useState<HubConnection>()
  const state = connection?.state
  const userRef = useRef<InputRef>(null)

  const handleSetConnection = (connection: HubConnection) => {
    setConnection(connection)
  }

  const stopConnection = async () => {
    await connection?.stop()
    setConnection(undefined)
  }

  const startConenction = async () => {
    const _connection = buildConnection()
    try {
      await _connection.start()
      handleSetConnection(_connection)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='w-full border-solid border-gray-200 border-b-2 border-0 flex justify-center'>
        <div className='w-1/2 py-5 px-10 flex gap-5'>
          <Input
            placeholder='username'
            size='large'
            ref={userRef}
            disabled={
              state === HubConnectionState.Connected ||
              state === HubConnectionState.Connecting ||
              state === HubConnectionState.Reconnecting ||
              state === HubConnectionState.Disconnected
            }
          />
          <Button
            type='primary'
            size='large'
            onClick={async () => {
              if (userRef.current?.input?.value) await startConenction()
            }}
            disabled={
              state === HubConnectionState.Connected ||
              state === HubConnectionState.Connecting ||
              state === HubConnectionState.Reconnecting ||
              state === HubConnectionState.Disconnected
            }
            loading={
              state === HubConnectionState.Connecting ||
              state === HubConnectionState.Reconnecting
            }>
            {!state || state === HubConnectionState.Disconnected
              ? 'Connect'
              : state}
          </Button>
          <Button
            type='default'
            size='large'
            onClick={stopConnection}
            disabled={
              !connection || connection?.state !== HubConnectionState.Connected
            }>
            Disconnect
          </Button>
        </div>
      </div>
      {connection && (
        <div className='w-full'>
          <ChatSpace
            username={userRef.current?.input?.value as string}
            connection={connection}
          />
        </div>
      )}
    </div>
  )
}
