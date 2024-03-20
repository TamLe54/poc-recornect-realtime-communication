import { DemoPage } from '../../../components'
import { SignalClient } from './signalR-client'

export const SignalRDemo = () => {
  return (
    <DemoPage title='singalr'>
      <SignalClient />
    </DemoPage>
  )
}
