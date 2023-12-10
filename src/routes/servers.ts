import express from "express";

import ServerRepository from "../db/serverRepository";
import { randomUUID } from "crypto";
import SessionRepository from "../db/sessionRepository";

type ServerControllerProps = {
  serverRepository: ServerRepository;
  sessionRepository: SessionRepository;
};

export function ServerController({
  sessionRepository,
  serverRepository,
}: ServerControllerProps) {
  const router = express.Router();

  router.post("/", create);
  router.get("/", readAll);

  async function create(req: express.Request, res: express.Response) {
    const { name, port } = req.body;
    const ip = req.socket.remoteAddress || "";
    const id = randomUUID();
    await serverRepository.create(id, name, `${ip}:${port}`);
    const server = await serverRepository.read(id);
    res.status(200).json(server);
  }

  async function readAll(req: express.Request, res: express.Response) {
    const sessions = await sessionRepository.getActiveSessions();
    console.log(sessions);
    const serverIds = sessions.map((session) => session.server_id);
    const servers = await serverRepository.readAllFromIds(serverIds);
    res.status(200).json(servers);
  }
  return router;
}
