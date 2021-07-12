import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import redis from "../../lib/redis";
import { getDefaultProvider } from "../../lib/provider";
import {
  getFuseState,
  SerializedFusePool,
  destructureNumberQuery,
  serializeFuseState,
} from "../../utils";

async function getSerializedFusePools(
  chainId: number
): Promise<SerializedFusePool[]> {
  const defaultProvider: ethers.providers.Provider =
    getDefaultProvider(chainId);
  const fuseState = await getFuseState(defaultProvider, chainId);
  return serializeFuseState(fuseState).pools;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ pools: SerializedFusePool[] }>
): Promise<void> {
  const {
    chainId,
  }: {
    [key: string]: string | string[] | undefined;
  } = req.query;
  const chainIdQuery: number = destructureNumberQuery(chainId, 1);
  const redisKey: string = "instalev-" + chainIdQuery.toString();
  let pools: SerializedFusePool[] = [];

  try {
    const redisPools = await redis.get(redisKey);
    if (redisPools === null) {
      pools = await getSerializedFusePools(chainIdQuery);
      if (pools.length > 0) {
        redis.set(redisKey, JSON.stringify(pools), "EX", 1800);
      }
    } else {
      pools = JSON.parse(redisPools) as SerializedFusePool[];
    }
  } catch (error) {
    console.log(error.message);
  }

  if (pools.length === 0) {
    try {
      pools = await getSerializedFusePools(chainIdQuery);
    } catch (error) {
      console.log(error.message);
    }
  }

  res.status(200).json({ pools });
}

export default handler;
