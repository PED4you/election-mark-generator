import { NextApiRequest, NextApiResponse } from "next"

import getDb from "@/lib/firebase-admin"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb()

  const images = await db.collection("images").get()

  if (!images) return res.status(500).json({ error: "No data" })

  const goodImages = images.docs.filter((image) => image.data().isGood).length
  const badImages = images.docs.filter((image) => !image.data().isGood).length

  return res.status(200).json({ goodImages: goodImages, badImages: badImages, totalImages: images.docs.length })
}
