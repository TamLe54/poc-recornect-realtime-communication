import { Button, Card, Checkbox, Col, Form, Input, Row, Select } from 'antd'
import { MqttClient } from 'mqtt'
import { TConnectClient } from '../../types'

type TMqttPublish = {
  client: MqttClient
}

export const MqttPublishion = ({ client }: TMqttPublish) => {
  const [form] = Form.useForm()
  const qosOptions = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ]
  const mqttPublish = (context: TConnectClient) => {
    if (client) {
      const { topic, qos, payload, retain } = context
      console.log(retain)
      client.publish(topic, payload, { qos, retain }, (error) => {
        if (error) {
          console.log('Publish error: ', error)
        }
      })
    }
  }

  // topic, QoS for publishing message
  const record = {
    topic: 'test-topic/react',
    qos: 0,
  }

  const onFinish = () => {
    const formValues = form.getFieldsValue(true)
    mqttPublish(formValues)
  }

  const PublishForm = (
    <Form
      layout='vertical'
      name='basic'
      form={form}
      initialValues={record}
      onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={10}>
          <Form.Item label='Topic' name='topic'>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='QoS' name='qos'>
            <Select options={qosOptions} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label='Retain Mesage'
            name='retain'
            valuePropName='checked'>
            <Checkbox />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='Payload' name='payload'>
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8} offset={16} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Publish
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card title='Publish a message' className='w-full'>
      {PublishForm}
    </Card>
  )
}
