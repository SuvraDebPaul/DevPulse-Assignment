import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import config from "../config";

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userStatusCode = error as { statusCode?: number };
  const statusCode = userStatusCode.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error instanceof Error ? error.message : "Something Went Wrong",
    error:
      config.node_env === "development" && error instanceof Error
        ? error
        : "Something Went Wrong",
    stack:
      config.node_env === "development" && error instanceof Error
        ? error.stack
        : undefined,
  });
};
