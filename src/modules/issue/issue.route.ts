import { Router } from "express";
import { IssueController } from "./issue.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

router.post("/", auth, IssueController.createIssue);

export const IssueRouter = router;
