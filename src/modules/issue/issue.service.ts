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

  const issueResult = await pool.query(
    `
    INSERT INTO issues(
      title, description, type, reporter_id
    ) VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, validUser.id],
  );

  return issueResult.rows[0];
};

const getAllIssuesFromDB = async (filters?: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort = "newest", type, status } = filters || {};
  let query = `SELECT  * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  query +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issueResult = await pool.query(query, values);
  const allIssues = await Promise.all(
    issueResult.rows.map(async (issue) => {
      const reporter = await pool.query(
        `SELECT id, name, role FROM users WHERE id=$1`,
        [issue.reporter_id],
      );
      const { reporter_id, created_at, updated_at, ...rest } = issue;
      return { ...rest, reporter: reporter.rows[0], created_at, updated_at };
    }),
  );
  return allIssues;
};

const getSingleIssuesFromDB = async () => {};

export const IssueService = {
  insertIssue,
  getAllIssuesFromDB,
  getSingleIssuesFromDB,
};
