import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para registrar las solicitudes HTTP.
 */
export const loggerMiddleware = (req: Request,res: Response,next: NextFunction): void => {
  const start = Date.now();

  // Intercepta la finalización de la respuesta para calcular la duración.
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};