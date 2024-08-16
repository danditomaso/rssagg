import type { Request } from "express"
import { AppError } from "../errors/CustomErrorBase"

// GetAPIKey extracts an API Key from
// the headers of an HTTP request
// example:
// Authorization: ApiKey {insert API key here}

export function getAPIKey(req: Request) {
  const authHeader = req.headers.authorization

  if (authHeader === "") return new AppError({ name: 'MISSING_AUTH', message: "No authorization info found" })

  const apiKey = authHeader?.split(' ')

  if (apiKey?.length !== 2) {
    return new AppError({ name: 'MALFORMED_AUTH', message: "Malformed auth header" })
  }

  if (apiKey.at(0) !== "ApiKey") {
    return new AppError({ name: 'MALFORMED_AUTH', message: "Malformed first part of the auth header" })
  }

  return apiKey.at(1) ?? new AppError({ name: 'UNEXPECTED_AUTH_ERROR', message: "An unexpected error occured while reading the api key'" })
}