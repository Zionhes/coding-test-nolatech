import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { LoginSchema } from "./schemas";
import type { Request, Response } from "express";
import { User } from "../../models/user.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

// Register user ======================================================================================================
export const register = async (data: any) => {
  const { firstName, lastName, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) return { status: 400, data: { message: "Email already registered" } };

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ firstName, lastName, email, password: hashedPassword, role });
  await newUser.save();

  return { status: 201, data: { message: "User registered successfully" } };
};

// Login and generate token ===========================================================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { status: 401, data: { message: "Invalid credentials" } };
    }

    if (!user) return { status: 400, message: "Invalid credentials" };

    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return {
      status: 201,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
      },
    };
  } catch (error) {
    return { status: 500, message: "Error logging in" };
  }
};

// Refresh token ======================================================================================================
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return { status: 401, message: "No refresh token provided" };

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    if (!decoded) return { status: 403, message: "Invalid refresh token" };

    const user = await User.findById(decoded.id);
    if (!user) return { status: 401, message: "User not found" };

    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return { status: 200, token: newAccessToken, message: "Access token refreshed" };
  } catch (error) {
    return { status: 500, message: "Error refreshing token" };
  }
};

// Logout =============================================================================================================
export const logout = async (_req: Request, res: any) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return { status: 200, data: { message: "Logged out successfully" } };
};
