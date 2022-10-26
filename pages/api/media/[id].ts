import { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import https from "https";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const source = Buffer.from(String(req.query.id), "base64").toString("utf-8").trim();

  const isHttps = source.startsWith("https");
  const protocol = isHttps ? https : http;

  return new Promise((resolve) => {
    try {
      // const { host, accept, "accept-encoding", "accept-language",  } = req.headers;
      const rawHeaders = {
        connection: req.headers["connection"],
        "user-agent": req.headers["user-agent"],
        "accept-encoding": req.headers["accept-encoding"],
        accept: req.headers["accept"],
        "sec-gpc": req.headers["sec-gpc"],
        "accept-language": req.headers["accept-language"],
        "sec-fetch-site": req.headers["sec-fetch-site"],
        "sec-fetch-mode": req.headers["sec-fetch-mode"],
        "sec-fetch-dest": req.headers["sec-fetch-dest"],
        range: req.headers["range"],
        referer: source,
      };
      const newHeaders = Object.fromEntries(
        Object.entries(rawHeaders).filter(([key, value]) => !!value)
      );
      // res.status(200).send(newHeaders);
      // return;
      // console.log({ source, newHeaders });
      protocol.get(
        source,
        {
          headers: newHeaders,
        },
        function (response) {
          const newHeaders = { ...response.headers };
          if (newHeaders.location)
            newHeaders.location = `/api/media/${Buffer.from(newHeaders.location, "utf-8").toString(
              "base64"
            )}`;
          res.writeHead(response.statusCode || 400, response.statusMessage, newHeaders);
          response.pipe(res);
          // response.on("end", res)
          resolve(0);
        }
      );
    } catch (error: any) {
      console.log(`catch`, error);
      res.status(400).send({ message: error.message, error });
    }
  }).catch((e) => {
    console.log(e);
    res.status(400).send({ message: e.message, error: e });
  });
}
