import type { Request, Response } from "express";
import { asyncHandler, sendResponse } from "../../shared/utils";
import { IssueService } from "./issue.service";
import AppError from "../../shared/error/appError";

const createIssue = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(404, "User Information Not Found");
  }
  const result = await IssueService.insertIssue(req.body, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue Created Scucessfully",
    data: result,
  });
});

const getAllIssues = asyncHandler(async (req: Request, res: Response) => {
  const { sort, type, status } = req.query;
  const result = await IssueService.getAllIssuesFromDB({
    sort: sort as string,
    type: type as string,
    status: status as string,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issues Retrived Scucessfully",
    data: result,
  });
});

const getSingleIssue = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await IssueService.getSingleIssuesFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single Issue Retrived Scucessfully",
    data: result,
  });
});

const updateSingleIssue = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(404, "User Not Found");
  }
  const { id } = req.params;
  const result = await IssueService.updateSingleIssueInDB(
    req.body,
    req.user,
    id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue Updated Scucessfully",
    data: result,
  });
});

const deleteSingleIssue = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(404, "User Not Found");
  }

  const { id } = await req.params;
  const result = await IssueService.deleteSingleIssueFromDB(
    req.user,
    id as string,
  );

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: result.message,
  });
});

export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateSingleIssue,
  deleteSingleIssue,
};
