import { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import https from "https";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const source = Buffer.from(String(req.query.id), "base64").toString("utf-8").trim();
  const isHttps = source.startsWith("https");
  const protocol = isHttps ? https : http;

  return new Promise((resolve) => {
    console.log(`aqui`, source);
    try {
      protocol.get(
        source,
        {
          headers: {
            ...req.headers,
            referer: source,
          },
        },
        function (response) {
          console.log(response.statusCode);
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
    } catch (error) {
      console.log(`deu erro aqui`);
    }
  }).catch((e) => {
    console.log(e);
    res.status(500).send({ message: e.message });
  });
}
