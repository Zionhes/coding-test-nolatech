import type { Request, Response } from "express";
import { register, login, logout, refreshAccessToken } from "./auth.service";

interface RequestWithCookies extends Request {
  cookies: { refreshToken?: string };
}

export const registerUser = async (req: Request, res: Response) => {
  const response = await register(req.body);
  res.status(response.status).json(response.data);
  return;
};

export const loginUser = async (req: Request, res: Response) => {
  const response = await login(req, res);
  res.status(response.status).json(response.data);
  return;
};

export const refreshToken = async (req: RequestWithCookies, res: Response) => {
  const response = await refreshAccessToken(req, res);
  res.status(response.status).json(response?.message);
  return;
};

export const logoutUser = async (req: RequestWithCookies, res: Response) => {
  const response = await logout(req, res);
  res.status(response.status).json(response.data);
  return;
};
