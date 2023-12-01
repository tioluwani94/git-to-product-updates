import { LinearClient } from "@linear/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

/**
 * Get team by id
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } =
      //@ts-ignore
      (await getServerSession(req, res, authOptions)) ?? {};

    const { team_id: id } = req.query;

    const linearClient = new LinearClient({
      accessToken,
    });

    const team = await linearClient.team(id as string);

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
