import { webauthnAuthenticate, webauthnRegister } from "@/services/webauthn"
import styles from "@/styles/Home.module.css"
import { Inter } from "next/font/google"
import { useState } from "react"
import { shortString } from "starknet"

const inter = Inter({ subsets: ["latin"] })

export default function Login() {
  const [logged, setLogged] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    const username = e.target.elements.name.value

    if (await webauthnRegister(username)) console.log("Register success!")
    else console.log("Register failure!")
  }

  const handleAuthenticate = async (e) => {
    e.preventDefault()
    const username = e.target.elements.name.value

    if (await webauthnAuthenticate(username)) {
      console.log("Authentication success!")
      setLogged(true)
    } else console.log("Authentication failure!")
  }

  if (!logged) {
    return (
      <>
        <main className={styles.code}>
          Web Wallet Login:
          <form onSubmit={handleRegister}>
            <label htmlFor="name">Username:</label>
            <input id="name" name="user_name" />
            <button type="submit">Register</button>
          </form>
          <form onSubmit={handleAuthenticate}>
            <label htmlFor="name">Username:</label>
            <input id="name" name="user_name" />
            <button type="submit">Authenticate</button>
          </form>
        </main>
      </>
    )
  } else {
    return (
      <h1>
        <div>
          Current account:
          <ul className="code">
            0x67b9be2bdf155e96fb195615eb825753b88840bc63bd976436060ebfd8401e0
          </ul>
          Network:
          <ul className="code">
            {shortString.decodeShortString("0x534e5f474f45524c49")}
          </ul>
        </div>
      </h1>
    )
  }
}
