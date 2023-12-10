import express from "express";
import cors from "cors";
import pg from "pg";
import ServerRepository from "./db/serverRepository";
import SessionRepository from "./db/sessionRepository";
import { ServerController } from "./routes/servers";
import { SessionController } from "./routes/sessions";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:password@localhost:5432/postgres",
});

const serverRepository = new ServerRepository(pool);
const sessionRepository = new SessionRepository(pool);

async function initRepositories() {
  await serverRepository.init();
  await sessionRepository.init();
  console.log("Finished initializing repositories");
}

initRepositories();

const serverController = ServerController({
  serverRepository,
  sessionRepository,
});
const sessionController = SessionController({ sessionRepository });

app.use("/servers", serverController);
app.use("/sessions", sessionController);

export default app;
