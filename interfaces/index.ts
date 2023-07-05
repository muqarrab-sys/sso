import { NextFunction, Request, Response } from "express";

export interface AuthorizationToken {
  uid: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: any;
}

export declare type IHandler = (req: Request, res: Response, next: NextFunction) => void;
