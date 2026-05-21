import type { NextFunction, Request, Response } from "express";
import AppError from "../shared/error/appError";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(404, "User Not Found");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        "Forbidden: You are not authorise to perform insuficient role",
      );
    }
    next();
  };
};
