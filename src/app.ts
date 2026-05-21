import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/errorHandler";
import { AuthRoutes } from "./modules/auth/auth.route";
import { IssueRouter } from "./modules/issue/issue.route";

const app: Application = express();

// Express Middleware
app.use(express.json());

//Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("API is Running");
});

//Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssueRouter);

// Error Middleware
app.use(globalErrorHandler);

export default app;
