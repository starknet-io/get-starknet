import type { Authenticator, UserModel } from "./types"
import { origin, rpID } from "./types"
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import base64url from "base64url"
import * as fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import * as path from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // Retrieve the logged-in user
    let username: string = req.query.username as string
    const userfile = fs.readFileSync(
      path.join("./server_data", username, "user.json"),
      { encoding: "utf8" },
    )
    const user: UserModel = JSON.parse(userfile)

    // Retrieve any of the user's previously-
    // registered authenticators
    let userAuthenticators: Authenticator[] = []
    const list = fs.readdirSync(
      path.join("./server_data", username, "authenticators"),
    )
    list.map((authenticatorFilename) => {
      const jsonFile = fs.readFileSync(
        path.join(
          "./server_data",
          username,
          "authenticators",
          authenticatorFilename,
        ),
        { encoding: "utf8" },
      )
      const authenticator = JSON.parse(jsonFile)
      authenticator.credentialID = Buffer.from(authenticator.credentialID.data)
      authenticator.credentialPublicKey = Buffer.from(
        authenticator.credentialPublicKey.data,
      )
      userAuthenticators.push(authenticator)
    })

    const options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    })

    // Remember this challenge for this user
    user.currentChallenge = options.challenge
    fs.writeFileSync(
      path.join("./server_data", username, "user.json"),
      JSON.stringify(user),
    )

    res.status(200).json(options)
  } else if (req.method === "POST") {
    const { body } = req

    // Retrieve the logged-in user
    let username: string = req.query.username as string
    // Retrieve the logged-in user
    const userfile = fs.readFileSync(
      path.join("./server_data", username, "user.json"),
      { encoding: "utf8" },
    )
    const user: UserModel = JSON.parse(userfile)

    // Get `options.challenge` that was saved above
    const expectedChallenge: string = user.currentChallenge ?? ""

    // Retrieve an authenticator from the DB that
    // should match the `id` in the returned credential
    let userAuthenticators: Authenticator[] = []
    const list = fs.readdirSync(
      path.join("./server_data", username, "authenticators"),
    )
    list.map((authenticatorFilename) => {
      const jsonFile = fs.readFileSync(
        path.join(
          "./server_data",
          username,
          "authenticators",
          authenticatorFilename,
        ),
        { encoding: "utf8" },
      )
      const authenticator = JSON.parse(jsonFile)
      authenticator.credentialID = Buffer.from(authenticator.credentialID.data)
      authenticator.credentialPublicKey = Buffer.from(
        authenticator.credentialPublicKey.data,
      )
      userAuthenticators.push(authenticator)
    })
    const authenticator = userAuthenticators.filter(
      (authenticator) =>
        base64url.encode(authenticator.credentialID) === body.id,
    )[0]

    if (!authenticator) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.id}`,
      )
    }

    let verification
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator,
      })
    } catch (error) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    /*const { verified } = verification
        if (verified === true) {
            const { authenticationInfo } = verification
            const { newCounter } = authenticationInfo
            saveUpdatedAuthenticatorCounter(authenticator, newCounter)
        }*/

    res.status(200).json(verification)
  }
}
