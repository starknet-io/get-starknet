import "./App.css"
import {
  type ConnectOptions,
  type DisconnectOptions,
  StarknetWindowObject,
  connect,
  disconnect,
} from "get-starknet"
import { useState } from "react"
import {
  AccountInterface,
  Contract,
  ProviderInterface,
  stark,
  uint256,
} from "starknet"

const ADDR_GROM_TOKEN =
  "0x053fe9d5fdce9c4cae6ad2a03b0ce2a3fc5cb3a4e6a18475addd1e09e67807b5"
const CLASS_HASH_GROM_TOKEN =
  "0x2784249255cace9a06ef1e25fa31f438a937a251e41ae80852afb1700755c9e"

function App() {
  const [swo, setSWO] = useState<StarknetWindowObject>()
  const [balance, setBalance] = useState("")
  const [txhash, setTxhash] = useState("")

  function handleConnect(options?: ConnectOptions) {
    return async () => {
      const res = await connect(options)
      console.log(res)
      res?.on("accountsChanged", (account: string[]) =>
        console.log("catch account changed: " + account[0]),
      )
      res?.on("networkChanged", (s?: string) =>
        console.log("catch network change: " + s),
      )
      if (res !== null) setSWO(res)
    }
  }

  function handleDisconnect(options?: DisconnectOptions) {
    return async () => {
      await disconnect(options)
      setSWO(undefined)
    }
  }

  const getERC20Balance = async () => {
    if (swo !== undefined && swo.provider != undefined) {
      const contractClass = await swo.provider.getClassAt(ADDR_GROM_TOKEN)
      if (contractClass.abi) {
        const ERC20Contract = new Contract(
          contractClass.abi,
          ADDR_GROM_TOKEN,
          swo.provider,
        )
        const balance = await ERC20Contract.balanceOf(swo.account?.address)
        console.log(uint256.uint256ToBN(balance.balance).toString())
        setBalance(uint256.uint256ToBN(balance.balance).toString())
      }
    }
  }

  const transferToken = async () => {
    const dest =
      "0x448bda3c2c437ca22579fed986eb65519820c52f2249a00370ec0f3d1902d78"
    // Execute tx transfer of 10 tokens
    console.log(`Invoke Tx - Transfer 10 tokens`)
    const toTransferTk = uint256.bnToUint256(10)
    const transferCallData = stark.compileCalldata({
      recipient: dest,
      amount: {
        type: "struct",
        low: toTransferTk.low,
        high: toTransferTk.high,
      },
    })

    const { transaction_hash: transferTxHash } = await swo?.account?.execute(
      {
        contractAddress: ADDR_GROM_TOKEN,
        entrypoint: "transfer",
        calldata: transferCallData,
      },
      undefined,
      { maxFee: 900_000_000_000_000 },
    )

    console.log("Transfer Tx hash: " + transferTxHash)
    setTxhash(transferTxHash)
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
      {swo && (
        <div>
          <h2>
            Selected Wallet:
            <pre>{swo.name}</pre>
            <pre>{swo.selectedAddress}</pre>
            <button onClick={getERC20Balance}>Get ERC20 Balance</button>
            {balance && <pre>{balance}</pre>}
            <button onClick={transferToken}>Transfer Token</button>
            {txhash && <pre>Tx hash: {txhash}</pre>}
          </h2>
        </div>
      )}
    </div>
  )
}

export default App
