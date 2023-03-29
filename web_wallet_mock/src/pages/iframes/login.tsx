import { webauthnAuthenticate } from "@/services/webauthn"
import { usePenpalParent } from "@weblivion/react-penpal"

export default function LoginModal() {
  const { parentMethods, connection } = usePenpalParent({
    methods: {},
  })

  const handleConnect = async (e) => {
    e.preventDefault()
    const username = e.target.elements.name.value

    if (await webauthnAuthenticate(username)) {
      console.log("Authentication success!")
      if (connection) {
        await parentMethods.connect()
      } else {
        console.log("No connection to parent frame :(")
      }
    } else console.log("Authentication failure!")
  }

  return (
    <div>
      <form onSubmit={handleConnect}>
        <label htmlFor="name">Username:</label>
        <input id="name" name="user_name" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
