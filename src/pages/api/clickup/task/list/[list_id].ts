import { authOptions } from "@/pages/api/auth/[...nextauth]";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } =
      //@ts-ignore
      (await getServerSession(req, res, authOptions)) ?? {};

    const {
      list_id,
      page,
      subtasks,
      statuses: s,
      archived,
      date_done_gt,
      include_closed,
    } = req.query;

    const statuses = !s ? undefined : Array.isArray(s) ? s : [s];

    const baseURL = `${process.env.CLICKUP_BASE_URL}/list/${list_id}/task`;

    const { data } = await axios.get(baseURL, {
      params: {
        page,
        subtasks,
        archived,
        date_done_gt,
        include_closed,
        ...statuses?.reduce((a, c, i) => ({ ...a, [`statuses[${i}]`]: c }), {}),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });
    res.status(200).json(data.tasks);
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
}
