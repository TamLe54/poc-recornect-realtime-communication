import { DemoPage } from '../../../components'
import { MQTTClient } from './mqtt_client'

export const MQTTDemo = () => {
  return (
    <DemoPage title='mqtt'>
      <MQTTClient />
    </DemoPage>
  )
}
