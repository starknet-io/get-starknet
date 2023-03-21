// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Authenticator, UserModel, origin, rpID, rpName } from "./types"
// ES Module (TypeScript, Babel, etc...)
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import { randomBytes } from "crypto"
import * as fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import * as path from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    let username: string = req.query.username as string
    const user: UserModel = {
      id: randomBytes(32).toString("hex"),
      username,
    }

    // Retrieve any of the user's previously-
    // registered authenticators
    const userAuthenticators: Authenticator[] = []

    const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.username,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
    })

    // (Pseudocode) Remember the challenge for this user
    //setUserCurrentChallenge(user, options.challenge)
    user.currentChallenge = options.challenge
    if (!fs.existsSync(path.join("./server_data", username))) {
      fs.mkdirSync(path.join("./server_data", username), { recursive: true })
    }
    fs.writeFileSync(
      path.join("./server_data", username, "user.json"),
      JSON.stringify(user),
    )

    res.status(200).json(options)
  } else if (req.method === "POST") {
    let username: string = req.query.username as string

    const { body } = req
    // Retrieve the logged-in user
    const userfile = fs.readFileSync(
      path.join("./server_data", username, "user.json"),
      { encoding: "utf8" },
    )
    const user: UserModel = JSON.parse(userfile)

    // Get `options.challenge` that was saved above
    const expectedChallenge = user.currentChallenge
    console.log(expectedChallenge)

    let verification
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      })
    } catch (error) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    if (verification.verified === true) {
      const { registrationInfo } = verification
      const { credentialPublicKey, credentialID, counter } = registrationInfo

      console.log("Register: Authenticator Credential ID = " + credentialID)

      const newAuthenticator: Authenticator = {
        credentialID: Buffer.from(credentialID),
        credentialPublicKey: Buffer.from(credentialPublicKey),
        counter,
      }

      if (
        !fs.existsSync(path.join("./server_data", username, "authenticators"))
      ) {
        fs.mkdirSync(path.join("./server_data", username, "authenticators"))
      }
      fs.writeFileSync(
        path.join(
          "./server_data",
          username,
          "authenticators",
          newAuthenticator.credentialID.toString("hex") + ".json",
        ),
        JSON.stringify(newAuthenticator),
      )
    }

    res.status(200).json(verification)
  }
}
