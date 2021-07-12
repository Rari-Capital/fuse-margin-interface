import type { NextApiRequest, NextApiResponse } from "next";
import { destructureNumberQuery } from "../../utils";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{}>
): Promise<void> => {
  const {
    chainId,
  }: {
    [key: string]: string | string[] | undefined;
  } = req.query;
  const chainIdQuery = destructureNumberQuery(chainId, 1);

  res.status(200).json({});
};
