import type { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../shared/utils";
import { AuthService } from "./auth.service";

const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.signupUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const AuthController = { signup, login };
