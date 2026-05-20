import type { NextFunction, Request, Response } from "express";

type TAsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const responseBody: Partial<TResponse<T>> = {
    success: responseData.success,
    message: responseData.message,
  };
  if (responseData.data) {
    responseBody.data = responseData.data;
  }
  if (responseData.meta) {
    responseBody.meta = responseData.meta;
  }

  res.status(responseData.statusCode).json(responseBody);
};

export const asyncHandler = (fn: TAsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next).catch((error) => next(error)));
  };
};
