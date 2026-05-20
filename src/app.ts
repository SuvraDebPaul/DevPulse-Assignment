import express, {
  json,
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running");
});

export default app;
