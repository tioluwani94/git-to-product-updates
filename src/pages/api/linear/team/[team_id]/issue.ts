import { LinearClient } from "@linear/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

/**
 * Get team issues
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

    const { team_id: id, states, start_date } = req.query;

    let filter = {};

    const linearClient = new LinearClient({
      accessToken,
    });

    if (states) {
      filter = {
        ...filter,
        state: { name: { in: states as string[] } },
      };
    }

    if (start_date) {
      filter = {
        ...filter,
        completedAt: { gte: new Date(start_date as string) },
      };
    }

    const team = await linearClient.team(id as string);
    const teamIssues = await team.issues({
      filter,
    });

    res
      .status(200)
      .json({ meta: teamIssues.pageInfo, issues: teamIssues.nodes });
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
