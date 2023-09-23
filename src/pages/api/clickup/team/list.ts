import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } =
      //@ts-ignore
      (await getServerSession(req, res, authOptions)) ?? {};

    const { data } = await axios.get(`${process.env.CLICKUP_BASE_URL}/team`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });
    res.status(200).json(data.teams);
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
