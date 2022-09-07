import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { enableCors } from 'utils/cors'

export async function getAccounts() {
  const page = await prisma.account.findMany({
    include: { requests: true },
  })

  return page
}

export async function updateAccount(accountId: string, data: any) {
  await prisma.account.update({ where: { accountId }, data })
}

const CreateAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  await enableCors(req, res)

  const { method, body } = req
  if (method === 'POST') {
    const { accountId, name } = body
    try {
      await prisma.account.create({
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
  }
  else if (method === "GET") {
    try {
      const data = await getAccounts()
      return res.status(200).json({
        error: false,
        data,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, data: { message: 'Method not allowed' } })
    }
  }
}

export default CreateAccount
