import { startAuthentication, startRegistration } from "@simplewebauthn/browser"

export const webauthnRegister = async (username: string): Promise<boolean> => {
  console.log("WebauthN register")

  const resp = await fetch(`/api/register?username=${username}`)

  console.log(resp)

  let attResp
  try {
    // Pass the options to the authenticator and wait for a response
    attResp = await startRegistration(await resp.json())
  } catch (error) {
    // Some basic error handling
    if (error.name === "InvalidStateError") {
      console.log(
        "Error: Authenticator was probably already registered by user",
      )
    } else {
      console.log(error.name)
    }
    throw error
  }

  // POST the response to the endpoint that calls
  // @simplewebauthn/server -> verifyRegistrationResponse()
  const verificationResp = await fetch(`/api/register?username=${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attResp),
  })

  // Wait for the results of verification
  const verificationJSON = await verificationResp.json()

  // Show UI appropriate for the `verified` status
  if (verificationJSON && verificationJSON.verified) {
    console.log("WebauthN register Success!")
    return true
  } else {
    console.log(
      "On no, something wen wrong! Response:" +
        JSON.stringify(verificationJSON),
    )
    return false
  }
}

export const webauthnAuthenticate = async (
  username: string,
): Promise<boolean> => {
  console.log("WebauthN authenticate")

  // GET authentication options from the endpoint that callss
  // @simplewebauthn/server -> generateAuthenticationOptions()
  const resp = await fetch(`/api/authentication?username=${username}`)

  console.log(resp)

  let asseResp
  try {
    // Pass the options to the authenticator and wait for a response
    asseResp = await startAuthentication(await resp.json())
  } catch (error) {
    // Some basic error handling
    console.log("Error when getting authentication options: " + error)
    throw error
  }

  // POST the response to the endpoint that calls
  // @simplewebauthn/server -> verifyAuthenticationResponse()
  const verificationResp = await fetch(
    `/api/authentication?username=${username}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asseResp),
    },
  )

  // Wait for the results of verification
  const verificationJSON = await verificationResp.json()

  // Show UI appropriate for the `verified` status
  if (verificationJSON && verificationJSON.verified) {
    console.log("WebauthN authenticate Success!")
    return true
  } else {
    console.log(
      "Oh no, something went wrong! Response:" +
        JSON.stringify(verificationJSON),
    )
    return false
  }
}
