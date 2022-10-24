import { NextApiRequest, NextApiResponse } from "next";

const urls: { id: string; source: string }[] = [];

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "POST") {
    const id = create_UUID();
    const source = JSON.parse(req.body).source;

    urls.push({ id, source });

    res.status(200).json({ ok: true, id, source });
  } else if (req.method === "GET") {
    const { id } = req.query;
    const url = urls.find((url) => url.id === id);
    if (url) {
      res.status(200).json(url);
    } else {
      res.status(404).json({ description: "Not found" });
    }
  }
}
