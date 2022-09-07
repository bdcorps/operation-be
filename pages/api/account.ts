import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { enableCors } from 'utils/cors'

type Data = {
  name: string
}

export async function getAccountByAccountId(accountId: string) {
  const page = await prisma.account.findFirst({
    where: { accountId },
    include: { requests: true },
  })

  return page
}

const CreateAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  await enableCors(req, res)

  const { method, body } = req
  if (method === 'POST') {
    const { accountId, name } = body
    try {
      const store = await prisma.account.create({
        data: {
          name,
          accountId,
        },
      })

      return res.status(200).json({ done: 'ok' })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, data: { message: 'Method not allowed' } })
    }
  } else if (method === "GET") {
    const { accountId } = body
    try {
      return res.status(200).json({
        error: false,
        data: getAccountByAccountId(accountId),
      })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, data: { message: 'Method not allowed' } })
    }
  }
}

export default CreateAccount
