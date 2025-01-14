import { Response } from "express";
import { ApiResponse } from "../interfaces/ApiResponse-interface";


/**
 * Envía una respuesta exitosa.
 * @param res Objeto Response de Express
 * @param data Datos a enviar
 * @param message Mensaje opcional
 * @param statusCode Código de estado HTTP (por defecto 200)
 */
export const sendSuccess = <T>(res: Response, data: T, message= "Operation successful", statusCode = 200) => {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message
    };

    res.status(statusCode).json(response)
}

/**
 * Envía una respuesta de error.
 * @param res Objeto Response de Express
 * @param error Error a enviar
 * @param message Mensaje opcional
 * @param statusCode Código de estado HTTP (por defecto 500)
 */
export const sendError = (res: Response, error: any, message = 'An error occurred', statusCode = 500) => {
    const response: ApiResponse<null> = {
      success: false,
      error,
      message,
    };
    res.status(statusCode).json(response);
}

export const sendQueryResult = <T>(data: T, message='Query executed successfully', statusCode = 200) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  }

  return {
    statusCode,
    response
  }
}