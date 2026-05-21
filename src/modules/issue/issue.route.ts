import { Router } from "express";
import { IssueController } from "./issue.controller";
import auth from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authorizeRoles";

const router = Router();

router.get("/", IssueController.getAllIssues);

router.post(
  "/",
  auth,
  authorizeRoles("contributor", "maintainer"),
  IssueController.createIssue,
);

export const IssueRouter = router;
