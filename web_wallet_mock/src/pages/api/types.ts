export type UserModel = {
  id: string
  username: string
  currentChallenge?: string
}

export type CredentialDeviceType = "singleDevice" | "multiDevice"

export type AuthenticatorTransport = "usb" | "ble" | "nfc" | "internal"

export type Authenticator = {
  credentialID: Buffer
  credentialPublicKey: Buffer
  counter: number
  credentialDeviceType?: CredentialDeviceType
  credentialBackedUp?: boolean
  transports?: AuthenticatorTransport[]
}

// Human-readable title for your website
export const rpName = "Fresh Web Wallet"
// A unique identifier for your website
export const rpID = "localhost"
// The URL at which registrations and authentications should occur
export const origin = `http://${rpID}:3005`
