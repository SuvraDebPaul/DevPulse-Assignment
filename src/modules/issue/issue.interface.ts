import type { JwtPayload } from "jsonwebtoken";

export type TType = "bug" | "feature request";
export type Tstatus = "open" | "in_progress" | "resolved";

export type TIssuePayload = {
  title: string;
  description: string;
  type: TType;
};

export type TIssueResponse = {
  id: number;
  title: string;
  description: string;
  type: TType;
  status: Tstatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};

export type TAuthUser = JwtPayload & {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
};
