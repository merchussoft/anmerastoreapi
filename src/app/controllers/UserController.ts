import { Route, Controller } from "../../utils/loadRoutes";
import { Request, Response } from 'express';
import { DatabaseConfig } from "../config/db";
import { DataRegisterUser } from "../../interfaces/dataRegisterUser-interface";
import bcrypt from 'bcrypt';
import { sendSuccessReturn } from "../../utils/responseHandler";


@Controller('/user')
export class UserController {

    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }

  
    /**
     * 
     * @param req aqui es ta ruta para visualizar los usuarios registradoe en la aplicacion 
     * @param res 
     */
    @Route('get', '/view-users')
    async getHome(req: Request, res: Response){
        const resultado_query = await this.db.obtieneDatos({table: process.env.DB_NAME_BASEADMIN + ".empleados"});
        res.status(resultado_query.statusCode).json(resultado_query);
    }



    @Route('post', '/updated-user', {authRequired: true})
    updateUser(req: Request, res: Response) {
        res.json({ message: 'Data updated successfully!' });
    }


    /**
     * @swagger
     * /delete-user:
     *   post:
     *     tags: [delete]
     *     summary: eliminar un nuevo usuario
     *     description: Endpoint para eliminar un usuario en la base de datos.
     */
    @Route('post', '/delete-user', {authRequired: true})
    deleteUser(req: Request, res: Response) {
        res.json({ message: 'Data deleted successfully!' });
    }


    /**
     * @swagger
     * /register-user:
     *   post:
     *     tags: [register]
     *     summary: Registrar un nuevo usuario
     *     description: Endpoint para registrar un nuevo usuario en la base de datos.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               usuario:
     *                 type: string
     *               nombre:
     *                 type: string
     *               email:
     *                 type: string
     *               telefono:
     *                 type: integer
     *               password:
     *                 type: string
     *               cod_perfil:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Usuario registrado exitosamente"
     *       400:
     *         description: Error en los datos proporcionados
     *       500:
     *         description: Error interno del servidor
     */
    @Route('post', '/register-user', {authRequired: true})
    async registerUser(req: Request, res: Response) {

        const data_json: DataRegisterUser = req.body
        data_json.password = await bcrypt.hash(data_json.password, 10);

        const {response: data}  = await this.db.obtieneDatos({
            table: process.env.DB_NAME_BASEADMIN + ".empleados",
            str_adicional: "AND (usuario=? OR email=?)"}, [data_json.usuario, data_json.email]
        );

        if(data.data.length === 0) {
            const { statusCode, response: {success}} = await this.db.insertTable(process.env.DB_NAME_BASEADMIN + ".empleados", data_json);
            if(success) return sendSuccessReturn(res, 'Usuario registrado exitosamente', statusCode);
            return sendSuccessReturn(res, 'Error al registrar al usuario', statusCode)
        }

        return sendSuccessReturn(res, 'el usuario o email ya existe por favor intentar con uno nuevo', 403)
    }
}