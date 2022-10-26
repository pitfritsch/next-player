import { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import https from "https";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const source = Buffer.from(String(req.query.id), "base64").toString("utf-8").trim();

  const isHttps = source.startsWith("https");
  const protocol = isHttps ? https : http;

  return new Promise((resolve) => {
    try {
      const { host, ...otherHeaders } = req.headers;
      const newHeaders = {
        ...otherHeaders,
        referer: source,
      };
      res.status(200).send(newHeaders);
      return;
      console.log({ source, newHeaders });
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
