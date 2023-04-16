import type { NextApiRequest, NextApiResponse } from "next"

import AWS from "aws-sdk"

import getDb from "@/lib/firebase-admin"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // data is in base64
  const { good, data: base64Data } = JSON.parse(req.body)

  // convert base64 to buffer
  const imgData = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), "base64")

  // upload to S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  })

  const filename = new Date().toISOString()

  const type = base64Data.split(";")[0].split("/")[1]

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env?.AWS_BUCKET_NAME ?? "",
    Key: `${good ? "good" : "bad"}-${filename}.${type}`,
    Body: imgData,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType: `image/${type}`, // required. Notice the back ticks
  }

  s3.upload(params, (err: any, data: any) => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: err })
    } else {
      const db = getDb()

      const imageData = {
        url: data.Location,
        isGood: good,
        createdAt: new Date().toISOString(),
        name: `${good ? "good" : "bad"}-${filename}`,
      }

      db.collection("images")
        .doc(`${good ? "good" : "bad"}-${filename}`)
        .set(imageData)

      res.status(200).json({ data: imageData })
    }
  })
}
