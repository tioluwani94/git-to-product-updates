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
      statuses,
      date_done_gt,
      date_done_lt,
      include_closed,
    } = req.query;

    console.log(req.query);

    const { data } = await axios.get(
      `${process.env.CLICKUP_BASE_URL}/list/${list_id}/task`,
      {
        params: {
          page,
          subtasks,
          statuses,
          date_done_gt,
          date_done_lt,
          include_closed,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },
      }
    );
    res.status(200).json(data.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
}
