import express, {
  json,
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/errorHandler";
import { AuthRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running");
});

//AuthRoutes
app.use("/api/auth", AuthRoutes);

app.use(globalErrorHandler);
export default app;

//Use Case
// sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "User created successfully",
//     data: result,
//   });

// const createUser = asyncHandler(async (req: Request, res: Response) => {} -> Controller

// throw new AppError(404, "User not found"); -> Service Layer
