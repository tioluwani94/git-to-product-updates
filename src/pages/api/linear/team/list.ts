import { LinearClient } from "@linear/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

/**
 * List workspace teams
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } =
      //@ts-ignore
      (await getServerSession(req, res, authOptions)) ?? {};

    const linearClient = new LinearClient({
      accessToken,
    });

    const teams = await linearClient.teams();

    res.status(200).json({ teams: teams.nodes, meta: teams.pageInfo });
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
