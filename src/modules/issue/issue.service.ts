import { pool } from "../../db";
import AppError from "../../shared/error/appError";
import type { TAuthUser, TIssuePayload } from "./issue.interface";

const insertIssue = async (payload: TIssuePayload, userPayload: TAuthUser) => {
  const { title, description, type } = payload;
  const { id } = userPayload;

  const userResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  const validUser = userResult.rows[0];
  if (!validUser) {
    throw new AppError(404, "User Not Valid");
  }

  const status = "open";
  const now = new Date();

  const issueResult = await pool.query(
    `
    INSERT INTO issues(
      title, description, type, status, reporter_id, created_at, updated_at
    ) VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [title, description, type, status, validUser.id, now, now],
  );

  return issueResult.rows[0];
};

export const IssueService = {
  insertIssue,
};
