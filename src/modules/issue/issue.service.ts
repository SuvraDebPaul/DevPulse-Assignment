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

const getSingleIssuesFromDB = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);
  const singleIssue = await Promise.all(
    issueResult.rows.map(async (issue) => {
      const reporter = await pool.query(
        `SELECT id, name, role FROM users WHERE id=$1`,
        [issue.reporter_id],
      );
      const { reporter_id, created_at, updated_at, ...rest } = issue;
      return { ...rest, reporter: reporter.rows[0], created_at, updated_at };
    }),
  );

  if (singleIssue.length === 0) {
    throw new AppError(404, "Issue Not Found");
  }

  return singleIssue;
};

const updateSingleIssueInDB = async (
  payload: TIssuePayload,
  userPayload: TAuthUser,
  id: string,
) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);
  const singleIssue = issueResult.rows[0];

  if (singleIssue.length === 0) {
    throw new AppError(404, "Issue Not Found");
  }

  const isContributor = userPayload.role === "contributor";
  if (isContributor) {
    if (singleIssue.reporter_id !== userPayload.id) {
      throw new AppError(403, "Contributors can only update their own issues");
    }
    if (singleIssue.status !== "open") {
      throw new AppError(
        403,
        "Contributors can only update issues with status 'open'",
      );
    }
  }

  const updatedTitle = payload.title ?? singleIssue[0].title;
  const updatedDescription = payload.description ?? singleIssue[0].description;
  const updatedType = payload.type ?? singleIssue[0].type;

  const updatedResult = await pool.query(
    `UPDATE issues SET title=$1, description=$2, type=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
    [updatedTitle, updatedDescription, updatedType, id],
  );

  return updatedResult.rows[0];
};

const deleteSingleIssueFromDB = async (userPayload: TAuthUser, id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);
  const singleIssue = issueResult.rows[0];
  console.log(singleIssue);
  if (!singleIssue) {
    throw new AppError(404, "Issue Not Found");
  }
  if (userPayload.role !== "maintainer") {
    throw new AppError(403, "Only maintainers can delete issues");
  }
  await pool.query(`DELETE FROM issues WHERE id=$1`, [id]);
  return { message: "Issue deleted successfully" };
};
export const IssueService = {
  insertIssue,
  getAllIssuesFromDB,
  getSingleIssuesFromDB,
  updateSingleIssueInDB,
  deleteSingleIssueFromDB,
};
