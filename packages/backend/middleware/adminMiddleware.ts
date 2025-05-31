import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { isAdmin: boolean };
}

const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log("User in adminMiddleware:", req.user);
  if (!req.user || !req.user.isAdmin) {
    return next(new Error("Access forbidden. Admins only."));
  }
  next();
};

export default adminMiddleware;
