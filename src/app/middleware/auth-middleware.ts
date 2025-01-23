import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { sendError } from '../../utils/responseHandler';
const jwtSecret = process.env.JWT_SECRET || 'secret_key'

export const authJswValidate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if(!token) return sendError(res, [], "Token no proporcionado", 401);

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
