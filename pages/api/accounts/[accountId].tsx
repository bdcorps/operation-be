import prisma from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { enableCors } from "utils/cors";

export async function updateAccount(accountId: string, data: any) {
  await prisma.account.update({ where: { accountId }, data });
}

export async function deleteAccount(accountId: string) {
  await prisma.account.delete({ where: { accountId } });
}

export async function getAccountByAccountId(accountId: string) {
  const page = await prisma.account.findFirst({
    where: { accountId },
    include: { requests: true },
  });

  return page;
}

const MainAccountEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await enableCors(req, res);

  const { method, query, body } = req;

  if (method === "GET") {
    const accountId = String(query.accountId);
    try {
      const site = await getAccountByAccountId(accountId);

      return res.status(200).json({
        error: false,
        data: site,
      });
    } catch (error) {
      return res.status(404).json({
        error: true,
      });
    }
  } else if (method === "PATCH") {
    const accountId = String(query.accountId);
    const { name, baseURL } = body;
    await updateAccount(accountId, { name, baseURL });

    return res.status(200).json({
      error: false,
      data: "ok",
    });
  } else if (method === "DELETE") {
    const accountId = String(query.accountId);
    await deleteAccount(accountId);

    return res.status(200).json({
      error: false,
      data: "ok",
    });
  } else {
    return res
      .status(405)
      .json({ error: true, data: { message: "Method not allowed" } });
  }
};

export default MainAccountEndpoint;
