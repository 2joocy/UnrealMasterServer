import express from "express";
import SessionRepository from "../db/sessionRepository";
import { randomUUID } from "crypto";
import ServerRepository from "../db/serverRepository";

type SessionControllerProps = {
  sessionRepository: SessionRepository;
};

export function SessionController({
  sessionRepository,
}: SessionControllerProps) {
  const router = express.Router();

  router.post("/", create);
  router.put("/:id", update);

  async function create(req: express.Request, res: express.Response) {
    const { server_id } = req.body;
    const id = randomUUID();
    await sessionRepository.create(id, server_id);
    const session = await sessionRepository.read(id);
    res.status(200).json(session);
  }

  async function update(req: express.Request, res: express.Response) {
    const { id } = req.params;
    await sessionRepository.updateSession(id);
    const session = await sessionRepository.read(id);
    res.status(200).json(session);
  }

  return router;
}
