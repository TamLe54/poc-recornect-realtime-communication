import { ConfigProvider, Tabs, TabsProps } from 'antd'
import './App.css'
import { MQTTDemo } from './features/mqtt'
import { SignalRDemo } from './features/signalR'

const TABS_KEY = {
  SIGNALR: 'signalR',
  MQTT: 'mqtt',
} as const

const items: TabsProps['items'] = [
  {
    key: TABS_KEY.SIGNALR,
    label: TABS_KEY.SIGNALR,
    children: <SignalRDemo />,
  },
  {
    key: TABS_KEY.MQTT,
    label: TABS_KEY.MQTT,
    children: <MQTTDemo />,
  },
]

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5A7C5A',
        },
      }}>
      <div className='p-10'>
        <Tabs items={items} defaultActiveKey={TABS_KEY.SIGNALR} size='large' />
      </div>
    </ConfigProvider>
  )
}

export default App
