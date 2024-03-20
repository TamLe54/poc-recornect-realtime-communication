import { MqttClient } from 'mqtt'
import { useEffect, useState } from 'react'
import { CONNECTION_STATES, TConnectionState, TReceivedPayload } from '../types'
import { MqttClientSpace } from './mqtt-client-space'
import { MQTTConnect } from './mqtt-process/mqtt-connect'

export const MQTTClient = () => {
  const [mqttClient, setMqttClient] = useState<MqttClient>()
  const [connectionState, setConnectionState] = useState<TConnectionState>(
    CONNECTION_STATES.DISCONNECTED
  )

  const [payloads, setPayloads] = useState<TReceivedPayload[]>([])

  useEffect(() => {
    if (mqttClient) {
      mqttClient.on('connect', () => {
        setConnectionState(CONNECTION_STATES.CONNECTED)
        console.log('connection successful')
      })

      mqttClient.on('error', (err) => {
        console.error('Connection error: ', err)
        mqttClient.end()
      })

      mqttClient.on('reconnect', () => {
        setConnectionState(CONNECTION_STATES.RECONNECTING)
      })

      mqttClient.on('message', (topic, message, { qos, retain }) => {
        const payload = { topic, message: message.toString(), qos, retain }
        setPayloads((prev) => [...prev, payload])
        console.log(`received message: ${message} from topic: ${topic}`)
      })
    }

    return () => {
      if (mqttClient) {
        mqttClient.end()
      }
    }
  }, [mqttClient])

  const handleSetConnectionState = (state: TConnectionState) => {
    setConnectionState(state)
  }

  const handleSetClient = (client: MqttClient) => {
    setMqttClient(client)
  }

  return (
    <div className='w-full flex flex-col gap-5'>
      <MQTTConnect
        client={mqttClient}
        connectionState={connectionState}
        setConnectionState={handleSetConnectionState}
        setClient={handleSetClient}
      />
      {mqttClient && connectionState === CONNECTION_STATES.CONNECTED && (
        <div className='flex flex-row w-full'>
          <MqttClientSpace client={mqttClient} payloads={payloads} />
        </div>
      )}
    </div>
  )
}
