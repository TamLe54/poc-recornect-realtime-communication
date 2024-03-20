import { Button, Card, Col, Form, Input, Row, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import mqtt, { IClientOptions, MqttClient } from 'mqtt'
import { BROKER_URL } from '../../constants'
import { useGetInitialConnectionOptions } from '../../handler'
import { CONNECTION_STATES, TConnectionState } from '../../types'

type TMQTTConnect = {
  client?: MqttClient
  connectionState: TConnectionState
  setConnectionState: (state: TConnectionState) => void
  setClient: (client: MqttClient) => void
}

export const MQTTConnect = ({
  client,
  connectionState,
  setConnectionState,
  setClient,
}: TMQTTConnect) => {
  const [form] = useForm()
  const initialConnectionOptions = useGetInitialConnectionOptions()

  const handleMqttConnect = (host: string, mqttOption: IClientOptions) => {
    setConnectionState(CONNECTION_STATES.CONNECTING)
    setClient(mqtt.connect(host, mqttOption))
    setConnectionState(CONNECTION_STATES.CONNECTED)
  }

  const handleMqttDisconnect = () => {
    if (client) {
      try {
        setConnectionState(CONNECTION_STATES.DISCONNECTING)
        client.end(false, () => {
          console.log('Disconnected successfully')
          setConnectionState(CONNECTION_STATES.DISCONNECTED)
        })
      } catch (error) {
        console.log('Disconnect error:', error)
      }
    }
  }

  const onFinish = () => {
    const { clientId, username, password } = form.getFieldsValue(true)
    const url = BROKER_URL
    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    }
    handleMqttConnect(url, options)
  }

  const ConnectionForm = (
    <Form
      layout='vertical'
      name='basic'
      form={form}
      initialValues={initialConnectionOptions}
      onFinish={onFinish}
      disabled={client && connectionState === CONNECTION_STATES.CONNECTED}>
      <Row gutter={12}>
        <Col span={5}>
          <Form.Item>
            <Typography.Text type='secondary'>{`URL: ${BROKER_URL}`}</Typography.Text>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='Client ID' name='clientId'>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='Username' name='username'>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='Password' name='password'>
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card
      title='Connection'
      actions={[
        <Button
          type='primary'
          onClick={() => {
            form.submit()
          }}
          disabled={client && connectionState === CONNECTION_STATES.CONNECTED}>
          {!client || connectionState === CONNECTION_STATES.DISCONNECTED
            ? 'Connect'
            : connectionState}
        </Button>,
        <Button
          danger
          onClick={() => {
            handleMqttDisconnect()
          }}>
          Disconnect
        </Button>,
      ]}>
      {ConnectionForm}
    </Card>
  )
}
