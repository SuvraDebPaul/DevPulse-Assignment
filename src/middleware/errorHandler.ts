import type { ErrorRequestHandler } from "express";
import config from "../config";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something Went Wrong";

  res.status(statusCode).json({
    success: false,
    message: message,
    error,
    stack: config.node_env === "development" ? error.stack : undefined,
  });
};
