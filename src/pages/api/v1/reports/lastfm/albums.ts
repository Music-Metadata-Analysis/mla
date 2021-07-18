import type { NextApiRequest, NextApiResponse } from "next";
import * as status from "../../../../../config/status";
import apiEndpoints from "../../../../../config/apiEndpoints";
import { body, validationResult } from "express-validator";
import nextConnect from "next-connect";
import LastFMProxy from "../../../../../integrations/lastfm/proxy.class";
import { ProxyError } from "../../../../../errors/proxy.error.class";

const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(405).json(status.STATUS_405_MESSAGE);
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({ onNoMatch });

handler.post(
  apiEndpoints.v1.reports.lastfm.albums,
  body("userName").isString(),
  body("userName").isLength({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(status.STATUS_400_MESSAGE);
    } else {
      const proxy = new LastFMProxy();
      try {
        const proxyResponse = await proxy.getTopAlbums(req.body.userName);
        res.status(200).json(proxyResponse);
      } catch (err) {
        errorResponse(err, res);
      }
    }
    next();
  }
);

const errorResponse = (err: ProxyError, res: NextApiResponse) => {
  if (err.clientStatusCode === 429) {
    res.status(429).json(status.STATUS_429_MESSAGE);
  } else {
    res.status(502).json(status.STATUS_502_MESSAGE);
  }
};

export default handler;
