import { MqttClient } from 'mqtt'
import { useState } from 'react'
import { TConnectClient, TReceivedPayload } from '../types'
import { MqttPublishion } from './mqtt-process/mqtt-publish'
import { MqttReceptions } from './mqtt-process/mqtt-receive'
import { MqttSubsciption } from './mqtt-process/mqtt-subcribe'

type TMQTTClientSpace = {
  client: MqttClient
  payloads: TReceivedPayload[]
}

export const MqttClientSpace = ({ client, payloads }: TMQTTClientSpace) => {
  const [currentSubscription, setCurrentSubscription] =
    useState<TConnectClient>()

  const handleSetCurrentSubscription = (subscription: TConnectClient) => {
    setCurrentSubscription(subscription)
  }

  const getPayloadsForSubscription = (topic: string) => {
    return payloads.filter((payload) => payload.topic === topic)
  }

  return (
    <div className='h-full flex flex-row gap-3'>
      <div className='w-full'>
        <MqttPublishion client={client} />
      </div>
      <div className='w-full'>
        <MqttSubsciption
          client={client}
          currentSubscription={currentSubscription}
          setCurrentSubscription={handleSetCurrentSubscription}
        />
      </div>
      <div className='w-full'>
        {currentSubscription && (
          <MqttReceptions
            client={client}
            currentSubscription={currentSubscription}
            payloads={getPayloadsForSubscription(currentSubscription.topic)}
          />
        )}
      </div>
    </div>
  )
}
