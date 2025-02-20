// Middleware for zodValidation and sanitization

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.format(),
        });
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
