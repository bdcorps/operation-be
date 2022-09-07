import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { enableCors } from 'utils/cors'

type Data = {
  name: string
}

const CreateRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  await enableCors(req, res)

  const { method, body } = req
  if (method === 'POST') {
    try {
      const request = await prisma.request.create({
        data: {
          name: "name",
          method: "GET",
          path: "/simple"
        },
      })

      return res.status(200).json({ done: 'ok' })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, data: { message: 'Method not allowed' } })
    }
  } else if (method === 'GET') {


  }
}

export default CreateRequest
