import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export interface RouteMeta {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
    path: string;
    middleware?: Array<(req: Request, res: Response, next: NextFunction) => void | ValidationChain >;
    description?: string;
    authRequired?: boolean;
}


// Definir el tipo de las opciones adicionales
export interface RouteOptions {
    authRequired?: boolean;
    middleware?: any[];
    description?: string;
  }