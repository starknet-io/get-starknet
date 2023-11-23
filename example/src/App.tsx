import "./App.css"
import * as util from "./lib"
import {
  type ConnectOptions,
  type DisconnectOptions,
  StarknetWindowObject,
  connect,
  disconnect,
} from "get-starknet"
import { useState } from "react"

function App() {
  const [walletInfo, setWalletInfo] = useState("")
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null)

  function handleConnect(options?: ConnectOptions) {
    return async () => {
      const res = await connect(options)
      console.log("wallet", res)
      setWallet(res)
      setWalletInfo(
        `Name: ${res?.name || ""}, Address: ${
          res?.selectedAddress || ""
        }, ChainId: ${res?.chainId || ""}`,
      )
    }
  }

  function handleDisconnect(options?: DisconnectOptions) {
    return async () => {
      await disconnect(options)
      setWalletInfo("")
    }
  }

  return (
    <div className="App">
      <h1>get-starknet</h1>
      <div className="card">
        <button onClick={handleConnect()}>Default</button>
        <button onClick={handleConnect({ modalMode: "alwaysAsk" })}>
          Always ask
        </button>
        <button onClick={handleConnect({ modalMode: "neverAsk" })}>
          Never ask
        </button>
        <button
          onClick={handleConnect({
            modalMode: "alwaysAsk",
            modalTheme: "dark",
          })}>
          Always ask with dark theme
        </button>
        <button
          onClick={handleConnect({
            modalMode: "alwaysAsk",
            modalTheme: "light",
          })}>
          Always ask with light theme
        </button>
        <button onClick={handleDisconnect()}>Disconnect</button>
        <button onClick={handleDisconnect({ clearLastWallet: true })}>
          Disconnect and reset
        </button>
      </div>
      {walletInfo && (
        <div>
          <h2>
            Selected Wallet: <pre>{walletInfo}</pre>
          </h2>
        </div>
      )}
      <ul>
        <li>
          <button
            onClick={() => {
              wallet && util.sendErc20Transaction(wallet)
            }}>
            send erc20 transaction
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              wallet && util.deployContract(wallet)
            }}>
            deploy contract
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              wallet && util.signMessage(wallet)
            }}>
            sign message
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              wallet && util.signMessageSlient(wallet)
            }}>
            sign message (slient)
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              wallet && util.signDeployAccountTransaction(wallet)
            }}>
            sign deploy account transaction
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              wallet && util.signDeclareTransaction(wallet)
            }}>
            sign delcare transaction
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              wallet && util.signTransaction(wallet)
            }}>
            sign transaction
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              wallet && util.getPubKey(wallet)
            }}>
            get public key
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              wallet && util.getNonce(wallet)
            }}>
            get Nonce
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              wallet && util.switchNetwork(wallet)
            }}>
            Switch Network
          </button>
        </li>
      </ul>
    </div>
  )
}

export default App
