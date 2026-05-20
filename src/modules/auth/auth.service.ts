import config from "../../config";
import { pool } from "../../db";
import AppError from "../../shared/error/appError";
import type { TLoginPayload, TSignupPayload } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signupUser = async (payload: TSignupPayload) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    throw new AppError(409, "User Already Exists With This Email");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role) 
    VALUES($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, passwordHash, role],
  );

  return result.rows[0];
};

const loginUser = async (payload: TLoginPayload) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length < 1) {
    throw new AppError(404, "User Not Found With This Email");
  }
  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError(401, "Password Does Not Match With This Email");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return {
    token,
    user: userResponse,
  };
};

export const AuthService = { signupUser, loginUser };
