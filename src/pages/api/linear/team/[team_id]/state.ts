import { LinearClient } from "@linear/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

/**
 * Get team states
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

    const { team_id: id } = req.query;

    const linearClient = new LinearClient({
      accessToken,
    });

    const team = await linearClient.team(id as string);
    const teamStates = await team.states();

    res
      .status(200)
      .json({ states: teamStates.nodes, meta: teamStates.pageInfo });
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
