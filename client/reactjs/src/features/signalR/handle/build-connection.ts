import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { SIGNALR_SERVER_URL } from '../constants'

export const buildConnection = (): HubConnection => {
  return new HubConnectionBuilder()
    .withUrl(SIGNALR_SERVER_URL, {
      withCredentials: false,
    })
    .withAutomaticReconnect()
    .build()
}
