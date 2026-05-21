import jwt, { type JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../shared/utils";
import type { NextFunction, Request, Response } from "express";
import AppError from "../shared/error/appError";
import config from "../config";

type TDecodedUser = JwtPayload & {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
};

const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorizationToken = req.headers.authorization;

    if (!authorizationToken) {
      throw new AppError(401, "You Are Not Authorized");
    }

    const decode = jwt.verify(
      authorizationToken,
      config.jwt_secret as string,
    ) as TDecodedUser;

    req.user = decode;

    next();
  },
);

export default auth;
