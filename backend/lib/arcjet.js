import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

// init arcjet 
export const ajt = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip"],
  rules: [

    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",

      allow: [
        "CATEGORY:SEARCH_ENGINE"

      ]
    }),


    // rate limiting

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ]
})