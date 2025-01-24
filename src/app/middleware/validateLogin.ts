import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../../utils/responseHandler';

export const validateLogin: Array<ValidationChain | ((req: Request, res: Response, next: NextFunction) => void)> = [
    // validar que el campo usuario
    body('usuario')
    .isString()
    .isLength({ min: 4 })
    .withMessage('El usuario debe tener al menos 4 caracteres')
    .notEmpty()
    .withMessage('El usuario es obligatorio'),

    // validar que el campo password
    body('password')
    .isString()
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía') // Validar que no esté vacía
    .isLength({ min: 4 })
    .withMessage('La contraseña debe tener al menos 4 caracteres'), // Validar longitud mínima

    // manejo de errores de validacion
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())  {
            const error = errors.array().map((err) => ({ type: 'field',msg: err.msg }))
            return sendError(res, 'advertencia', error[0].msg, 401);
        }
        next();
    }
]