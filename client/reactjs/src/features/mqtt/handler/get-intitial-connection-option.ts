import { IClientOptions } from 'mqtt'

export const useGetInitialConnectionOptions = (): IClientOptions => {
  return {
    clientId: 'mqtt_client_react' + Math.random().toString(16).substring(2, 8),
    username: 'mqtt_client_react',
    password: 'mqtt_client_react',
  }
}
