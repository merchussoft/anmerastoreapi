import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { sendError, sendSuccessReturn } from '../../utils/responseHandler';
const jwtSecret = process.env.JWT_SECRET || 'secret_key'
const revokedTokens: string[] = []; // En un entorno real, deberías usar una base de datos

export const authJswValidate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if(!token) return sendError(res, [], "Token no proporcionado", 401);

    // verificar si el token esta en lista negra
    if (checkBlacklistedToken(token)) {
        return sendSuccessReturn(res, "El token ha sido revocado", 401)
    }

    try {
        const decoded_token = jwt.verify(token, jwtSecret);
        (req as any).user = decoded_token;
        next();
    } catch (err) {
        return sendError(res, [], "Token inválido", 401)
    }
}


export const jwtEncoded = (data:{}) => {
    try {
        return jwt.sign(data, jwtSecret, { expiresIn: '1h' });
    } catch (error) {
        console.log('Error al crear el token ', error)
    }
}

const checkBlacklistedToken = (token: string) => {
    return revokedTokens.includes(token);
}


export const logoutUser = (token: string): void => {
    revokedTokens.push(token);
    console.log(`Token ${token} revoked`);
}
