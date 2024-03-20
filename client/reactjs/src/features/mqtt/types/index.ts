export type TConnectClient = {
  topic: string
  payload: string | Buffer
  qos: 0 | 1 | 2
  retain: boolean
}

export type TOptions = {
  value: string | number
  label: string
}

export type TReceivedPayload = {
  topic: string
  message: string | Buffer
  qos: 0 | 1 | 2
  retain: boolean
}

export const CONNECTION_STATES = {
  CONNECTED: 'Connected',
  CONNECTING: 'Connecting',
  DISCONNECTED: 'Disconnected',
  DISCONNECTING: 'Disconnecting',
  RECONNECTING: 'Reconnecting',
} as const

export type TConnectionState =
  (typeof CONNECTION_STATES)[keyof typeof CONNECTION_STATES]
