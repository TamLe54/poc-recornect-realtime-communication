import { CloseCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { MqttClient } from 'mqtt'
import { useState } from 'react'
import { PRIMARY_COLOR } from '../../../../constant'
import { TConnectClient } from '../../types'

type TMqttSubsciption = {
  client: MqttClient
  currentSubscription?: TConnectClient
  setCurrentSubscription: (subscription: TConnectClient) => void
}

const initialRecord = {
  topic: '',
  qos: 0,
}

export const MqttSubsciption = ({
  client,
  currentSubscription,
  setCurrentSubscription,
}: TMqttSubsciption) => {
  const [form] = useForm()
  const qosOptions = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ]

  const [subscriptions, setSubcriptions] = useState<TConnectClient[]>([])

  const handleMqttSubscribe = (subscription: TConnectClient) => {
    if (client) {
      const { topic, qos } = subscription

      if (subscriptions.some((sub) => sub.topic === topic)) return

      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log(`Subscribe to topics: ${topic}`)
        setSubcriptions([...subscriptions, subscription])
        setCurrentSubscription(subscription)
      })
    }
  }

  const handleMqttUnsubscribe = (subscription: TConnectClient) => {
    if (client) {
      const { topic, qos } = subscription

      if (!subscriptions.some((sub) => sub.topic === topic)) return

      client.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }
        console.log(`unsubscribed topic: ${topic}`)
        setSubcriptions(subscriptions.filter((sub) => sub.topic !== topic))
        if (currentSubscription?.topic === topic)
          setCurrentSubscription(subscriptions[0])
      })
    }
  }

  const onFinish = () => {
    const formValues = form.getFieldsValue(true)
    handleMqttSubscribe(formValues)
  }
  const unsubscribeHandler = () => {
    const values = form.getFieldsValue()
    handleMqttUnsubscribe(values)
  }

  const SubForm = (
    <Form
      layout='vertical'
      name='basic'
      form={form}
      initialValues={initialRecord}
      onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item label='Topic' name='topic'>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='QoS' name='qos'>
            <Select options={qosOptions} />
          </Form.Item>
        </Col>
        <Col span={8} offset={16} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Subscribe
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card title='Subscription' className='w-full flex flex-col gap-2'>
      <>{SubForm}</>

      <List
        bordered
        dataSource={subscriptions}
        renderItem={(subscription) => (
          <List.Item
            style={{
              border:
                currentSubscription &&
                currentSubscription.topic === subscription.topic
                  ? `2px solid ${PRIMARY_COLOR}`
                  : '',
            }}
            className='select-none cursor-pointer rounded-md '
            onClick={() => {
              if (subscription.topic !== currentSubscription?.topic)
                setCurrentSubscription(subscription)
            }}>
            <Typography.Title level={3}>{subscription.topic}</Typography.Title>
            <Typography.Text> {`qos: ${subscription.qos}`}</Typography.Text>
            <Tooltip title={'Unsubscribe'}>
              <CloseCircleOutlined
                className='text-red-500'
                onClick={(e) => {
                  e.stopPropagation()
                  unsubscribeHandler()
                }}
              />
            </Tooltip>
          </List.Item>
        )}
      />
    </Card>
  )
}
