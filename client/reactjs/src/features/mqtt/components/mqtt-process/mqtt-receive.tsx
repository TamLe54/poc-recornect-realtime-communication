import { Badge, Card, List } from 'antd'
import { MqttClient } from 'mqtt'
import { PRIMARY_COLOR } from '../../../../constant'
import { TConnectClient, TReceivedPayload } from '../../types'

type TMqttReceptions = {
  payloads: TReceivedPayload[]
  currentSubscription: TConnectClient
  client: MqttClient
}

export const MqttReceptions = ({
  payloads,
  currentSubscription,
  client,
}: TMqttReceptions) => {
  const { topic } = currentSubscription
  const { username } = client.options

  return (
    <Card
      className='w-full'
      title='Receptions'
      extra={
        <div className='flex flex-col gap-2'>
          <p>Topic: {topic}</p>
          <p>Username: {username}</p>
        </div>
      }>
      <List
        bordered
        dataSource={payloads}
        renderItem={(payload) => (
          <Badge.Ribbon
            text={`${payload.retain ? 'Retain' : ''}`}
            color={PRIMARY_COLOR}>
            <List.Item className='select-none cursor-pointer rounded-md'>
              <List.Item.Meta
                title={`${payload.topic}-qos:${payload.qos}`}
                description={`${
                  payload.retain ? 'Retain' : ''
                }${payload.message.toString()}`}>
                <div>QOS: {payload.qos}</div>
              </List.Item.Meta>
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </Card>
  )
}
